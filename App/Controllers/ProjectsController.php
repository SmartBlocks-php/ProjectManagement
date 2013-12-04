<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 10/16/13
 * Time: 11:04 PM
 */

namespace ProjectManagement;

class ProjectsController extends \Controller {
    public function before_filter() {
        \User::restrict();
    }

    public function index() {
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        $qb->select('e')->from('\ProjectManagement\Project', 'e')->leftJoin('e.participants', 'p')->where('e.owner = :user OR p = :user')
           ->setParameter('user', \User::current_user());

        $results = $qb->getQuery()->getResult();
        $response = array();
        foreach ($results as $result) {
            $response[] = $result->toArray();
        }
        $this->return_json($response);
    }

    private function createOrUpdate($data) {
        if (isset($data["id"]))
            $project = Project::find($data["id"]);
        else
            $project = null;

        if (!is_object($project)) {
            $project = new Project();
        }

        $project->setOwner(\User::current_user());

        $project->setName($data["name"]);
        unset($data["name"]);
        if (isset($data["description"])) {
            $project->setDescription($data["description"]);
            unset($data["description"]);
        }

        unset($data["owner"]);
        unset($data["id"]);

        if (isset($data["deadlines"]) && is_array($data["deadlines"])) {
            $project->save();
            $project->getDeadlines()->clear();
            foreach ($data["deadlines"] as $deadline_a) {
                if (isset($deadline_a["id"]))
                    $deadline = \TaskManagement\Task::find($deadline_a["id"]);
                if (isset($deadline) && is_object($deadline)) {
                    $project->getDeadlines()->add($deadline);
                }
                else {
                    $deadline = \ProjectManagement\Business\Deadlines::createOrUpdate($deadline_a);
                    $deadline->setProject($project);
                    $deadline->save();
                }
                $project->getDeadlines()->add($deadline);
            }
        }
        unset($data["deadlines"]);

        if (isset ($data["participants"]) && is_array($data["participants"])) {
            $array = $project->getParticipants()->toArray();

            $project->getParticipants()->clear();
            foreach ($data["participants"] as $parray) {
                if (isset($parray["id"])) {
                    $user = \User::find($parray["id"]);
                    $project->getParticipants()->add($user);
                }
            }
            foreach ($project->getDeadlines() as $deadline) {
                $deadline->updateParticipants($project->getParticipants());
            }
            echo "\nHEY1\n";
            $events_to_delete = array();
            foreach ($array as $old) {
                echo "\nHEY2\n";
                if (!$project->getParticipants()->contains($old)) {
                    foreach ($project->getDeadlines() as $d) {
                        echo "\nHEY3\n";
                        foreach ($d->getTasks() as $t) {
                            echo "\nHEY4\n";
                            if ($t->getParticipants()->contains($old))
                                $t->getParticipants()->remove($old);
                            foreach ($t->getEvents() as $e) {
                                echo "\nHEY5\n";
                                if (is_object($old) && is_object($e->getOwner()))
                                    if ($e->getOwner()->getId() == $old->getId()) {

                                        $events_to_delete[] = $e->getid();
                                    }
                            }
                            $t->save();
                            \NodeDiplomat::sendMessage($old, array(
                                    "block" => "TaskManagement",
                                    "action" => "deleted_task",
                                    "task" => $t->toArray()
                                )
                            );
                        }
                    }
                }
            }

            foreach ($events_to_delete as $id) {
                $event = \Time\Event::find($id);
                $event->delete();
            }

            unset($data["participants"]);
        }

        $event_data = $data;
        $data_array = $project->getData();

        if (is_array($event_data)) {
            foreach ($event_data as $key => $d) {
                $data_array[$key] = $d;
            }
        }

        foreach ($data_array as $key => $d) {
            if (!isset($event_data[$key])) {
                unset($data_array[$key]);
            }
        }
        $project->setData($data_array);

        $project->save();

        ob_clean();
        return $project->toArray();
    }

    public function create() {
        $data = $this->getRequestData();
        $this->return_json($this->createOrUpdate($data));
    }

    public function update($data = array()) {

        $id = $data["id"];
        $data = $this->getRequestData();

        if (isset($data["id"]))
            $project = Project::find($data["id"]);
        else
            $project = null;
        if (is_object($project)) {
            if ($project->getOwner() == \User::current_user()) {
                $this->return_json($this->createOrUpdate($data));
            }
            else {
                $this->json_error("This project does not exist", 404);
            }
        }
        else {
            $this->json_error("This project does not exist", 404);
        }
    }

    public function destroy($data = array()) {
        $project = Project::find($data["id"]);
        if (is_object($project)) {
            if ($project->getOwner() == \User::current_user()) {
                $project->delete();
                $this->json_message("Successfully deleted project");
            }
            else {
                $this->json_error("This project does not exist", 404);
            }
        }
        else {
            $this->json_error("This event does not exist", 404);
        }
    }
}