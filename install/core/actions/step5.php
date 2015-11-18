<?php
$fields = array(
	'smtpServer' => array(),
	'smtpPort' => array(
		'default' => '25',
	),
	'smtpAuth' => array(),
	'smtpSecurity' => array(
		'default' => (isset($settingsDefaults['smtpSecurity']['default'])) ? $settingsDefaults['smtpSecurity']['default'] : ''),
	'smtpUsername' => array(),
	'smtpPassword' => array(),
	
	'outboundEmailFromName' => array(),
	'outboundEmailFromAddress' => array(),
	'outboundEmailIsShared' => array(),
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
