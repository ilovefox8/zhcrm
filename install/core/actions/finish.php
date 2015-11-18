<?php
$cronMessage = $installer->getCronMessage();

$smarty->assign('cronTitle', $cronMessage['message']);
$smarty->assign('cronHelp', $cronMessage['command']);

$installer->setSuccess();

// clean session
session_unset();