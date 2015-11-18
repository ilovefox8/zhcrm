<?php
ob_start();
$result = array('success' => true, 'errorMsg' => '');

// save settings
$data = array(
	'driver' => 'pdo_mysql',
	'dbname' => $_SESSION['install']['db-name'],
	'user' => $_SESSION['install']['db-user-name'],
	'password' => $_SESSION['install']['db-user-password'],
);
$host = $_SESSION['install']['host-name'];
if (strpos($host,':') === false) {
		$host .= ":";
}
list($data['host'], $data['port']) = explode(':', $host);

$lang = (!empty($_SESSION['install']['user-lang']))? $_SESSION['install']['user-lang'] : 'en_US';
if (!$installer->saveData($data, $lang)) {
	$result['success'] = false;
	$result['errorMsg'] = $langs['messages']['Can not save settings'];
}

ob_clean();
echo json_encode($result);
