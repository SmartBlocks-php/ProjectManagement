<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 10/16/13
 * Time: 11:04 PM
 */

namespace ProjectManagement;

class DeadlineController extends \Controller
{
    public function before_filter()
    {
        \User::restrict();
    }


    public function index()
    {
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        $qb->select('e')->from('\ProjectManagement\Deadline', 'e')->where('e.owner = :user')
            ->setParameter('user', \User::current_user());

        $results = $qb->getQuery()->getResult();
        $response = array();
        foreach ($results as $result)
        {
            $response[] = $result->toArray();
        }
        $this->return_json($response);
    }

    private function createOrUpdate($data)
    {
        if (isset($data["id"]))
            $deadline = Deadline::find($data["id"]);
        else
            $deadline = null;

        if (!is_object($deadline))
        {
            $deadline = new Deadline();
        }

        $deadline->setOwner(\User::current_user());

        $deadline->setName($data["name"]);
        unset($data["name"]);
        if (isset($data["description"]))
        {
            $deadline->setDescription($data["description"]);
            unset($data["description"]);
        }

        unset($data["owner"]);
        unset($data["id"]);

        $event_data = $data;
        $data_array = $deadline->getData();

        if (is_array($event_data))
        {
            foreach ($event_data as $key => $d)
            {
                $data_array[$key] = $d;
            }

        }

        foreach ($data_array as $key => $d)
        {
            if (!isset($event_data[$key])) {
                unset($data_array[$key]);
            }
        }
        $deadline->setData($data_array);

        //tasks

        if (isset($data["tasks"]) && is_array($data["tasks"]))
        {
            $deadline->getTasks()->clear();
            foreach ($data["tasks"] as $task_a)
            {
                $task = \TaskManagement\Task::find($task_a["id"]);
                if (is_object($task))
                {
                    $deadline->getTasks()->add($task);
                }
            }
        }

        $deadline->save();

        return $deadline->toArray();
    }

    public function create()
    {
        $data = $this->getRequestData();
        $this->return_json(\ProjectManagement\Business\Deadlines::createOrUpdate($data)->toArray());
    }

    public function update($data = array())
    {

        $id = $data["id"];
        $data = $this->getRequestData();

        if (isset($data["id"]))
            $deadline = Deadline::find($data["id"]);
        else
            $deadline = null;
        if (is_object($deadline))
        {
            if ($deadline->getOwner() == \User::current_user())
            {
                $this->return_json($this->createOrUpdate($data));
            }
            else
            {
                $this->json_error("This deadline does not exist", 404);
            }
        }
        else
        {
            $this->json_error("This deadline does not exist", 404);
        }
    }


    public function destroy($data = array())
    {
        $deadline = Deadline::find($data["id"]);
        if (is_object($deadline))
        {
            if ($deadline->getOwner() == \User::current_user())
            {
                $deadline->delete();
                $this->json_message("Successfully deleted deadline");
            }
            else
            {
                $this->json_error("This deadline does not exist", 404);
            }
        }
        else
        {
            $this->json_error("This event does not exist", 404);
        }
    }

}