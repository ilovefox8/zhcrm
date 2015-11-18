<?php
session_start();

require_once('../bootstrap.php');

//action
$action = (!empty($_POST['action']))? $_POST['action'] : 'main';
require_once('core/Utils.php');
if (!Utils::isActionExists($action)) {
	die('This page does not exist.');
}

// temp save all settings
$ignoredFields = array('installProcess', 'dbName', 'hostName', 'dbUserName', 'dbUserPass', 'dbDriver');

if (!empty($_POST)) {
	foreach ($_POST as $key => $val) {
		if (!in_array($key, $ignoredFields)) {
			$_SESSION['install'][$key] = trim($val);
		}
	}
}

// get user selected language
$userLang = (!empty($_SESSION['install']['user-lang']))? $_SESSION['install']['user-lang'] : 'en_US';

require_once 'core/Language.php';
$language = new Language();
$langs = $language->get($userLang);
//END: get user selected language

$config = include('core/config.php');

require_once 'core/SystemHelper.php';
$systemHelper = new SystemHelper();

if (version_compare(PHP_VERSION, '5.4.0', '<')) {
    die(str_replace('{minVersion}', $config['requirements']['phpVersion'], $langs['messages']['phpVersion']) . '.');
}

if (!$systemHelper->initWritable()) {
	$dir = $systemHelper->getWritableDir();

	$message = $langs['messages']['Bad init Permission'];
	$message = str_replace('{*}', $dir, $message);
	$message = str_replace('{C}', $systemHelper->getPermissionCommands(array($dir, ''), '775'), $message);
	$message = str_replace('{CSU}', $systemHelper->getPermissionCommands(array($dir, ''), '775', true), $message);
	die($message);
}

require_once ('install/vendor/smarty/libs/Smarty.class.php');

require_once 'core/Installer.php';
require_once 'core/Utils.php';

$smarty = new Smarty();
$installer = new Installer();

// check if app was installed
if ($installer->isInstalled() && !isset($_SESSION['install']['installProcess'])) {
	$url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
	$url = preg_replace('/install\/?/', '', $url, 1);
	$url = strtok($url, '#');
	$url = strtok($url, '?');
	header("Location: {$url}");
	exit;
}
else {
	// double check if infinite loop
	$_SESSION['install']['installProcess'] = true;
}

$smarty->caching = false;
$smarty->setTemplateDir('install/core/tpl');

$smarty->assign("version", $installer->getVersion());
$smarty->assign("langs", $langs);
$smarty->assign("langsJs", json_encode($langs));

// include actions and set tpl name
switch ($action) {
	case 'main':
		$languageList = $installer->getLanguageList();
		$smarty->assign("languageList", $languageList);
		break;

	case 'step3':
	case 'errors':
	case 'setupConfirmation':
		$smarty->assign("apiPath", $systemHelper->getApiPath());
		$modRewriteUrl = $systemHelper->getModRewriteUrl();
		$smarty->assign("modRewriteUrl", $modRewriteUrl);
		$serverType = $systemHelper->getServerType();
		$smarty->assign("serverType", $serverType);
		$os = $systemHelper->getOS();
		$smarty->assign("OS", $os);
		break;

    case 'step4':
    	$settingsDefaults = $installer->getSettingDefaults();
		$smarty->assign("settingsDefaults", $settingsDefaults);
		break;

    case 'step5':
    	$settingsDefaults = $installer->getSettingDefaults();
		$smarty->assign("settingsDefaults", $settingsDefaults);
		break;
}

$actionFile = 'core/actions/'.$action.'.php';
$tplName = $action.'.tpl';
$smarty->assign('tplName', $tplName);
$smarty->assign('action', ucfirst($action));

/** config */
$smarty->assign('config', $config);

if (Utils::isActionExists($action)) {
	include $actionFile;
}

if (!empty($actionFile) && file_exists('install/core/tpl/'.$tplName)) {
	/*check if FoxCRM is built*/
	$isBuilt = file_exists('client/espo.min.js');
	$smarty->assign('isBuilt', $isBuilt);

	ob_clean();
	$smarty->display('index.tpl');
}
