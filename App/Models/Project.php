<?php
/**
 * Date: 12/03/2013
 * Time: 11:28
 * This is the model class called File
 */
namespace ProjectManagement;
use ReflectionClass;

/**
 * @Entity @Table(name="project_management_project")
 */
class Project extends \Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @Column(type="string")
     */
    private $name;

    /**
     * @Column(type="text")
     */
    private $description;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $owner;

    /**
     * @Column(type="text")
     */
    private $data;

    /**
     * @OneToMany(targetEntity="\ProjectManagement\Deadline", mappedBy="project")
     */
    private $deadlines;

    /**
     * @ManyToMany(targetEntity="\User")
     */
    private $participants;

    public function __construct()
    {
        $this->data = json_encode(array());
        $this->description = "";
        $this->deadlines = new \Doctrine\Common\Collections\ArrayCollection();
        $this->participants = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setOwner($owner)
    {
        $this->owner = $owner;
    }

    public function getOwner()
    {
        return $this->owner;
    }

    public function getData()
    {
        return json_decode($this->data, true);
    }

    public function setData($data)
    {
        $this->data = json_encode($data);
    }

    public function setDeadlines($deadlines)
    {
        $this->deadlines = $deadlines;
    }

    public function getDeadlines()
    {
        return $this->deadlines;
    }

    /**
     * @param mixed $participants
     */
    public function setParticipants($participants) {
        $this->participants = $participants;
    }

    /**
     * @return mixed
     */
    public function getParticipants() {
        return $this->participants;
    }


    public function toArray()
    {
        $participants = array();

        foreach ($this->participants as $participant) {
            $participants[] = $participant->toArray();
        }

        $array = array(
            "id" => $this->id,
            "name" => $this->name,
            "description" => $this->description,
            "owner" => $this->getOwner() != null ? $this->getOwner()->toArray() : null,

        );

        $data = $this->getData();
        if (is_array($data))
        {
            foreach ($data as $key => $value)
            {
                $array[$key] = $value;
            }
        }
        $array["participants"] = $participants;

        return $array;
    }

    function save() {
        parent::save();

        foreach ($this->getParticipants() as $p) {
            \NodeDiplomat::sendMessage($p->getSessionId(), array(
                    "block" => "ProjectManagement",
                    "action" => "saved_project",
                    "project" => $this->toArray()
                )
            );
        }
    }
}