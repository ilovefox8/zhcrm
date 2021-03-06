<?php
$fields = array(
	'db-name' => array(),
	'host-name' => array(
		'default' => (isset($langs['labels']['localhost']))? $langs['labels']['localhost'] : '',),
	'port' => array(),
	'db-user-name' => array(),
	'db-user-password' => array(),
	'db-driver' => array()
);

foreach ($fields as $fieldName => $field) {
	if (isset($_SESSION['install'][$fieldName])) {
		$fields[$fieldName]['value'] = $_SESSION['install'][$fieldName];
	}
	else {
		$fields[$fieldName]['value'] = (isset($fields[$fieldName]['default']))? $fields[$fieldName]['default'] : '';
	}
}

$smarty->assign('fields', $fields);