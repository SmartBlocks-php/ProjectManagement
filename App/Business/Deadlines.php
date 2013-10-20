<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 10/20/13
 * Time: 4:47 PM
 */


namespace ProjectManagement\Business;

class Deadlines
{
    public static function  createOrUpdate($data)
    {
        if (isset($data["id"]))
            $deadline = \ProjectManagement\Deadline::find($data["id"]);
        else
            $deadline = null;

        if (!is_object($deadline))
        {
            $deadline = new  \ProjectManagement\Deadline();
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
        unset($data["tasks"]);

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
            if (!isset($event_data[$key]))
            {
                unset($data_array[$key]);
            }
        }
        $deadline->setData($data_array);



        $deadline->save();

        return $deadline;
    }
}