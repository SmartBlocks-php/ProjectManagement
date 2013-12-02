<?php
/**
 * Date: 12/03/2013
 * Time: 11:28
 * This is the model class called File
 */
namespace ProjectManagement;
/**
 * @Entity @Table(name="project_management_project_requests",uniqueConstraints={@UniqueConstraint(name="requests_idx", columns={"project_id", "target_user_id"})})
 */
class ProjectRequest extends \Model {
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @ManyToOne(targetEntity="\ProjectManagement\Project")
     */
    private $project;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $target_user;

    /**
     * @Column(type="boolean")
     */
    private $status;

    public function __construct() {
        $this->status = false;
    }

    public function getId() {
        return $this->id;
    }

    /**
     * @param \ProjectManagement\Project $project
     */
    public function setProject($project) {
        $this->project = $project;
    }

    /**
     * @return \ProjectManagement\Project
     */
    public function getProject() {
        return $this->project;
    }

    /**
     * @param bool $status
     */
    public function setStatus($status) {
        $this->status = $status;
    }

    /**
     * @return bool
     */
    public function getStatus() {
        return $this->status;
    }

    /**
     * @param \User $target_user
     */
    public function setTargetUser($target_user) {
        $this->target_user = $target_user;
    }

    /**
     * @return \User
     */
    public function getTargetUser() {
        return $this->target_user;
    }

    public function toArray() {
        $array = array(
            "id" => $this->id,
            "project" => $this->project->toArray(),
            "target_user" => $this->target_user->toArray(),
            "status" => $this->status
        );

        return $array;
    }
}