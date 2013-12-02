<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 10/16/13
 * Time: 11:04 PM
 */

namespace ProjectManagement;

class ProjectRequestsController extends \Controller
{
    public function before_filter()
    {
        \User::restrict();
    }


    public function index()
    {
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        $qb->select('pr')->from('\ProjectManagement\ProjectRequest', 'pr')
            ->leftJoin('pr.project', 'project')
            ->leftJoin('project.participants', 'participant')
            ->where('pr.target_user = :user OR project.owner = :user OR participant = :user')
            ->setParameter('user', \User::current_user());

        $results = $qb->getQuery()->getResult();
        $response = array();

        foreach ($results as $result)
        {
            $response[] = $result->toArray();
        }
        $this->return_json($response);
    }

    public function create()
    {
        $data = $this->getRequestData();
        $prequest = \ProjectManagement\Business\ProjectRequests::createOrUpdate($data);
        $this->return_json($prequest->toArray());
    }

    public function update($data = array())
    {

        $id = $data["id"];
        $data = $this->getRequestData();
        $data["id"] = $id;

        if (isset($data["id"]))
            $prequest = ProjectRequest::find($data["id"]);
        else
            $prequest = null;
        if (is_object($prequest))
        {
            if ($prequest->getProject()->getOwner() == \User::current_user() || $prequest->getTargetUser() == \User::current_user())
            {
                $this->return_json(\ProjectManagement\Business\ProjectRequests::createOrUpdate($data)->toArray());
            }
            else
            {
                $this->json_error("This project request does not exist", 404);
            }
        }
        else
        {
            $this->json_error("This project request does not exist", 404);
        }
    }


    public function destroy($data = array())
    {
        $prequest = ProjectRequest::find($data["id"]);
        if (is_object($prequest))
        {
            if ($prequest->getProject()->getOwner() == \User::current_user() || $prequest->getTargetUser() == \User::current_user())
            {
                $prequest->delete();
                $this->json_message("Successfully deleted project request");
            }
            else
            {
                $this->json_error("This project request does not exist", 404);
            }
        }
        else
        {
            $this->json_error("This project request does not exist", 404);
        }
    }

}