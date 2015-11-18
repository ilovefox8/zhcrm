<?php
ob_start();
$result = array('success' => false, 'errorMsg' => '');

if (!empty($_SESSION['install'])) {
	$preferences = array(
		'dateFormat' => $_SESSION['install']['dateFormat'], 
		'timeFormat' => $_SESSION['install']['timeFormat'],
		'timeZone' => $_SESSION['install']['timeZone'],
		'weekStart' => (int)$_SESSION['install']['weekStart'],
		'defaultCurrency' => $_SESSION['install']['defaultCurrency'],
		'thousandSeparator' => $_SESSION['install']['thousandSeparator'],
		'decimalMark' => $_SESSION['install']['decimalMark'],
		'language' => $_SESSION['install']['language'],
	);
	$res = $installer->setPreferences($preferences);
	if (!empty($res)) {
		$result['success'] = true;
	}
	else {
		$result['success'] = false;
		$result['errorMsg'] = 'Cannot save preferences';
	}
}
else {
	$result['success'] = false;
	$result['errorMsg'] = 'Cannot save preferences';
}

ob_clean();
echo json_encode($result);
