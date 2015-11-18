<?php
class Utils
{
	static public $actionPath = 'install/core/actions';

	static public function isActionExists($actionName)
	{
		$actionPath = static::$actionPath;
		$actionFileName = $actionName . '.php';
		$actionRealPath = realpath($actionPath . '/' . $actionFileName);

		$fileManager = new \Fox\Core\Utils\File\Manager();
		$actionList = $fileManager->getFileList($actionPath);

		foreach ($actionList as $fileName) {
			$fileRealPath = realpath($actionPath . '/' . $fileName);

			if ($fileRealPath === $actionRealPath) {
				return true;
			}
		}

		return false;
	}
}