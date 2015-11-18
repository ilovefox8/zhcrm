<?php
ob_start();

$result = array('success' => true, 'errors' => array());

$res = $systemHelper->checkRequirements();
$result['success'] &= $res['success'];
if (!empty($res['errors'])) {
	$result['errors'] = array_merge($result['errors'], $res['errors']);
}

if ($result['success'] && !empty($_REQUEST['dbName']) && !empty($_REQUEST['hostName']) && !empty($_REQUEST['dbUserName'])) {
	$connect = false;

	$dbName = trim($_REQUEST['dbName']);
	if (strpos($_REQUEST['hostName'],':') === false) {
		$_REQUEST['hostName'] .= ":";
	}
	list($hostName, $port) = explode(':', trim($_REQUEST['hostName']));
	$dbUserName = trim($_REQUEST['dbUserName']);
	$dbUserPass = trim($_REQUEST['dbUserPass']);

	$res = $systemHelper->checkDbConnection($hostName, $port, $dbUserName, $dbUserPass, $dbName);
	$result['success'] &= $res['success'];
	if (!empty($res['errors'])) {
		$result['errors'] = array_merge($result['errors'], $res['errors']);
	}

}

ob_clean();
echo json_encode($result);
