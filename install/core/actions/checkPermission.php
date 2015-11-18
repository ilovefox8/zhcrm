<?php
ob_start();
$result = array('success' => true, 'errorMsg' => '');

if (!$installer->checkPermission()) {
	$result['success'] = false;
	$error = $installer->getLastPermissionError();
	$urls = array_keys($error);
	$group = array();
	foreach($error as $folder => $permission) {
		$group[implode('-', $permission)][] = $folder;
	}
	ksort($group);
	$instruction = '';
	$instructionSU = '';
	$changeOwner = true;
	foreach($group as $permission => $folders) {
		if ($permission == '0644-0755') $folders = '';
		$instruction .= $systemHelper->getPermissionCommands(array($folders, ''), explode('-', $permission), false, null, $changeOwner) . "<br>";
		$instructionSU .= "&nbsp;&nbsp;" . $systemHelper->getPermissionCommands(array($folders, ''), explode('-', $permission), true, null, $changeOwner) . "<br>";
		if ($changeOwner) {
			$changeOwner = false;
		}
	}
	$result['errorMsg'] = $langs['messages']['Permission denied to'] . ':<br><pre>/'.implode('<br>/', $urls).'</pre>';
	$result['errorFixInstruction'] = str_replace( '"{C}"' , $instruction, $langs['messages']['permissionInstruction']) . "<br>" .
										str_replace( '{CSU}' , $instructionSU, $langs['messages']['operationNotPermitted']);
}

ob_clean();
echo json_encode($result);
