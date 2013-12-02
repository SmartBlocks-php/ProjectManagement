<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 10/20/13
 * Time: 4:47 PM
 */

namespace ProjectManagement\Business;

use ProjectManagement\ProjectRequest;

class ProjectRequests {
    public static function  createOrUpdate($data) {
        if (isset($data["id"]))
            $prequest = \ProjectManagement\ProjectRequest::find($data["id"]);
        else
            $prequest = null;

        if (!is_object($prequest)) {
            $prequest = new  \ProjectManagement\ProjectRequest();
        }
        $user = null;
        if (isset($data["target_user"]) && is_array($data["target_user"])) {
            $user = \User::find($data["target_user"]["id"]);
            if (is_object($user)) {
                $prequest->setTargetUser($user);
            }
        }
        $project = null;
        if (isset($data["project"]) && is_array($data["project"])) {
            $project = \ProjectManagement\Project::find($data["project"]["id"]);
            if (is_object($project)) {
                $prequest->setProject($project);
            }
        }

        if (isset($data["status"])) {
            $prequest->setStatus($data["status"]);
        }

        if (is_object($prequest->getProject()) && $prequest->getProject()->getOwner() == \User::current_user()) {
            try {
                $prequest->save();
            } catch (\PDOException $e) {
                if ($e->getCode() == 23000) {
                    $prequests = ProjectRequest::where(array(
                            "target_user" => $user,
                            "project" => $project
                        )
                    );
                    if (isset($prequests[0])) {
                        return $prequests[0];
                    }
                    else {
                        return null;
                    }
                } else {
                    throw $e;
                }
            }
            return $prequest;
        }
        else {
            return null;
        }
    }
}