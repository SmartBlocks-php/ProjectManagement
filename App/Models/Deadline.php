<?php
/**
 * Date: 12/03/2013
 * Time: 11:28
 * This is the model class called File
 */
namespace ProjectManagement;
use ReflectionClass;

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

    /**
     * @return \ProjectManagement\Project
     */
    public function getProject()
    {
        return $this->project;
    }

    /**
     * @return \TaskManagement\Task[]
     */
    public function getTasks()
    {
        return $this->tasks;
    }

    public function updateParticipants($participants) {
        foreach ($this->getTasks() as $t) {
            $t->getParticipants()->clear();
            foreach ($participants as $p) {
                $t->getParticipants()->add($p);
                \Model::persist($t);
            }
            $t->getParticipants()->add($this->getOwner());
        }
        \Model::flush();
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
            "project" => is_object($this->project) ? $this->project->toArray() : null
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

    function save() {
        parent::save();
        $this->updateParticipants($this->getProject()->getParticipants());

        foreach ($this->getProject()->getParticipants() as $p) {
            foreach ($this->getTasks() as $t) {
                \NodeDiplomat::sendMessage($p->getSessionId(), array(
                        "block" => "TaskManagement",
                        "action" => "saved_task",
                        "task" => $t->toArray()
                    )
                );
            }
            \NodeDiplomat::sendMessage($p->getSessionId(), array(
                    "block" => "ProjectManagement",
                    "action" => "saved_deadline",
                    "deadline" => $this->toArray()
                )
            );
        }
        foreach ($this->getTasks() as $t) {
            \NodeDiplomat::sendMessage($this->getProject()->getOwner()->getSessionId(), array(
                    "block" => "TaskManagement",
                    "action" => "saved_task",
                    "task" => $t->toArray()
                )
            );
        }
        \NodeDiplomat::sendMessage($this->getProject()->getOwner()->getSessionId(), array(
                "block" => "ProjectManagement",
                "action" => "saved_deadline",
                "deadline" => $this->toArray()
            )
        );
    }

    function delete() {

        foreach ($this->getProject()->getParticipants() as $p) {
            foreach ($this->getTasks() as $t) {
                \NodeDiplomat::sendMessage($p->getSessionId(), array(
                        "block" => "TaskManagement",
                        "action" => "deleted_task",
                        "task" => $t->toArray()
                    )
                );
            }
            \NodeDiplomat::sendMessage($p->getSessionId(), array(
                    "block" => "ProjectManagement",
                    "action" => "deleted_deadline",
                    "deadline" => $this->toArray()
                )
            );
        }
        foreach ($this->getTasks() as $t) {
            \NodeDiplomat::sendMessage($this->getProject()->getOwner()->getSessionId(), array(
                    "block" => "TaskManagement",
                    "action" => "deleted_task",
                    "task" => $t->toArray()
                )
            );
        }
        \NodeDiplomat::sendMessage($this->getProject()->getOwner()->getSessionId(), array(
                "block" => "ProjectManagement",
                "action" => "deleted_deadline",
                "deadline" => $this->toArray()
            )
        );

        parent::delete();
    }
}