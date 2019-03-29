<?php

require '../vendor/autoload.php';

use Google\Cloud\Datastore\DatastoreClient;

// putenv('GOOGLE_APPLICATION_CREDENTIALS=../key.json');

function get_ds_client() {
	return new DatastoreClient([
    	'projectId' => 'sacred-catfish-180704',
	    'namespaceId' => 'prod',
	]);
}

class cache {
	const CACHE_DIR		= '../cache/';
	const FILE_PREFIX	= 'cache_';
	const FILE_EXT		= '.php';
	const TTL			= 3600;

	function path($name) {
		$path = self::CACHE_DIR. self::FILE_PREFIX. $name. self::FILE_EXT;
		$dir = dirname($path);
		!file_exists($path) && mkdir($dir, 0755, true);
		return $path;
	}

	function getset($name, callable $func, $ttl = 0, array $params = []) {
		if (!is_string($name) || !$name) {
			return null;
		}
		$result = self::get($name, $ttl, $params);
		$need_result = true;
		if ($result) {
			$need_result = false;
		} elseif (is_array($result) || (is_string($result) && ($result === '' || $result === '0' || $result === 'false'))) {
			$need_result = false;
		}
		if ($need_result) {
			$result = $func($name, $ttl, $params);
			if ($result !== null) {
				self::set($name, $result, $ttl);
			}
		}
		return $result;
	}

	function get($name, $ttl = 0, $params = []) {
		$path = self::path($name);
		if ($path && file_exists($path)) {
			$last_modified = filemtime($path);
			$ttl = intval($ttl ?: self::TTL);
			if ($last_modified < (time() - $ttl)) {
				return null;
			}
			return include $path;
		}
		return null;
	}

	function set($name, $data, $ttl = 0) {
		$path = self::path($name);
		if ($path) {
			$str = str_replace(' => '.PHP_EOL.'array (', '=>array(', preg_replace('/^\s+/m', '', var_export($data, 1)));
			$str = '<?'.'php'.PHP_EOL.'return '.$str.';'.PHP_EOL;
			return (bool)file_put_contents($path, $str);
		}
		return false;
	}
}

function obj2arr(&$obj) {
	$obj = (array)$obj;
	foreach ($obj as &$v) {
		if (is_object($v) && $v instanceof DateTimeImmutable) {
			$v->setTimezone('UTC');
			$v = $v->format('Y-m-d');
		}
		if (is_array($v)) {
			obj2arr($v);
		}
	}
	return $obj;
}

function printr($var, $do_not_echo = false) {
	ob_start();
	print_r($var);
	$code =  htmlentities(ob_get_clean());
	if (!$do_not_echo) {
		echo '<pre><small>'.$code.'</small></pre>';
	}
	return $code;
}

function html_table($data = [], $force_keys = [], $skip_keys = []){
	$html[] = '<table class="table table-striped table-bordered table-responsive">';
	$keys = $force_keys ?: array_keys(current($data));
	foreach ($keys as $id => $key) {
		if ($skip_keys && in_array($key, $skip_keys)) {
			unset($keys[$id]);
			continue;
		}
		$html[] = '<th class="thead-dark">'.$key.'</th>';
	}
	foreach ($data as $id => $row) {
		$html[] = '<tr>';
		foreach ($keys as $name) {
			$v = $row[$name];
			if (is_array($v)) {
				$tmp = [];
				foreach ($v as $k1 => $v1) {
					$v1 && $tmp[] = $k1.' ('.$v1.')';
				}
				$v = implode('<br>', $tmp);
			}
			$html[] = '<td>' . $v . '</td>';
		}
		$html[] = '</tr>';
	}
	$html[] = '</table>';
	return implode(PHP_EOL, $html);
}

function html_out($html = []){

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
	<title>Teams details</title>
</head>
<body>
<?php 
	echo $html;
?>	
</body>
</html>
<?php

}
