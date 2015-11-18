<?php
ob_start();
$result = array('success' => false, 'errorMsg' => '');

if (!empty($_SESSION['install'])) {
	$preferences = array(
		'smtpServer' => $_SESSION['install']['smtpServer'],
		'smtpPort' => $_SESSION['install']['smtpPort'],
		'smtpAuth' => (empty($_SESSION['install']['smtpAuth']) || $_SESSION['install']['smtpAuth'] == 'false' || !$_SESSION['install']['smtpAuth'])? false : true,
		'smtpSecurity' => $_SESSION['install']['smtpSecurity'],
		'smtpUsername' => $_SESSION['install']['smtpUsername'],
		'smtpPassword' => $_SESSION['install']['smtpPassword'],
		'outboundEmailFromName' => $_SESSION['install']['outboundEmailFromName'],
		'outboundEmailFromAddress' => $_SESSION['install']['outboundEmailFromAddress'],
		'outboundEmailIsShared' => (empty($_SESSION['install']['smtpAuth']) || $_SESSION['install']['outboundEmailIsShared'] == 'false' || !$_SESSION['install']['smtpAuth'])? false : true,
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
