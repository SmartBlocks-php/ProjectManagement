<?php
/**
 * Date: 12/03/2013
 * Time: 11:28
 * This is the model class called File
 */
namespace ProjectManagement;
/**
 * @Entity @Table(name="project_management_deadline")
 */
class Deadline extends \Model
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
     * @Column(type="datetime")
     */
    private $date;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $owner;

    /**
     * @Column(type="text")
     */
    private $data;

    /**
     * @ManyToOne(targetEntity="Project")
     */
    private $project;

    /**
     * @ManyToMany(targetEntity="\TaskManagement\Task")
     */
    private $tasks;


    public function __construct()
    {
        $this->data = json_encode(array());
        $this->description = "";
        $this->date = new \DateTime();
        $this->tasks = new \Doctrine\Common\Collections\ArrayCollection();

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

    public function setDate($date)
    {
        $this->date = $date;
    }

    public function getDate()
    {
        return $this->date;
    }

    public function setProject($project)
    {
        $this->project = $project;
    }

    public function getProject()
    {
        return $this->project;
    }

    public function getTasks()
    {
        return $this->tasks;
    }

    public function toArray()
    {

        $tasks = array();
        foreach ($this->tasks as $task)
        {
            $tasks[] = $task->toArray();
        }
        $array = array(
            "id" => $this->id,
            "name" => $this->name,
            "description" => $this->description,
            "owner" => $this->getOwner() != null ? $this->getOwner()->toArray() : null,
            "date" => $this->getDate()->format('Y-m-d\TH:i:s.uO'),
            "tasks" => $tasks,
            "project" => $this->project->toArray()
        );

        $data = $this->getData();
        if (is_array($data))
        {
            foreach ($data as $key => $value)
            {
                $array[$key] = $value;
            }
        }

        return $array;
    }
}