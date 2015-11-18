<?php
$phpConfig = $systemHelper->getRecommendationList();
$smarty->assign('phpConfig', $phpConfig);

$installData = $_SESSION['install'];
list($host, $port) = explode(':', $installData['host-name']);

$dbConfig = array(
    'dbHostName' => $host,
    'dbPort' => $port,
    'dbName' => $installData['db-name'],
    'dbUserName' => $installData['db-user-name'],
    'dbUserPass' => $installData['db-user-password'],
);
$mysqlConfig = $systemHelper->getRecommendationList('mysql', $dbConfig);

$dbConfig['dbHostName'] = $installData['host-name'];
unset($dbConfig['dbPort'], $dbConfig['dbUserPass']);

foreach ($dbConfig as $name => $value) {
	$mysqlConfig[$name] = array(
		'current' => $value,
		'acceptable' => true,
	);
}

$smarty->assign('mysqlConfig', $mysqlConfig);