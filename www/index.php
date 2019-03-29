<?php
require './lib.php';

$ds = get_ds_client();

$q = $ds->query();
$q->kind('team');
$res = $ds->runQuery($q);
foreach ($res as $_val) {
	$team_tmp[] = $_val->get();
}
foreach($team_tmp as $k => $_v){
	$team[$_v['id']] = $_v;
}

$query = $ds->query();
$query->kind('user_schedules');
$res = $ds->runQuery($query);
foreach ($res as $s) {
    $schedules_tmp[] = $s->get();
}
foreach($schedules_tmp as $k => $data){
	$schedules[$data['id']][$data['TeamID']][$data['UserID']] = $data['date_time'];
}

$q = $ds->query();
$q->kind('matches');
$res = $ds->runQuery($q);
foreach ($res as $val) {
	$matches_tmp[] = $val->get();
}
foreach($matches_tmp as $_k => $v){
	$matches[$v['id']] = $v;
	if(isset($team[$v['side_1']])){
		$matches[$v['id']]['side_1'] = $team[$v['side_1']]['name'];
	}
	if(isset($team[$v['side_2']])){
		$matches[$v['id']]['side_2'] = $team[$v['side_2']]['name'];
	}
//	if(isset($schedules[$v['id']])){
	if($matches[$v['id']]['side_2'] != ""){
		list($selected_day, $side1, $side2) = calc_dates($schedules[$v['id']]);
		$matches[$v['id']]['selected_day'] = $selected_day;
		$matches[$v['id']]['team1'] = $side1;
		$matches[$v['id']]['team2'] = $side2;
	}
}
ksort($matches);
uasort($matches, function($a, $b) {
	$k = 'first_date';
    if ($a[$k] == $b[$k]) {
        return 0;
    }
    return ($a[$k] < $b[$k]) ? -1 : 1;
});
function calc_dates($date_time = []){
/*	if(empty($date_time)){
return '';
}
 */
	$team1 = key($date_time);
	$mon = $tue = $wed = $thu = $fri = $sat = $sat2 = 0;
	$team2_mon = $team2_tue = $team2_wed = $team2_thu = $team2_fri = $team2_sat = $team2_sat2 = 0;
	foreach($date_time as $team => $v){
		foreach ($v as $_k => $data){
			foreach($data as $k){
				if($team1 == $team){
					if($k == 'Monday 6pm PT'){
						$mon++;
					}
					if($k == 'Tuesday 6pm PT'){
						$tue++;
					}
					if($k == 'Wednesday 6pm PT'){
						$wed++;
					}
					if($k == 'Thursday 6pm PT'){
						$thu++;
					}
					if($k == 'Friday 6pm PT'){
						$fri++;
					}
					if($k == 'Saturday 11am PT'){
						$sat++;
					}
					if($k == 'Saturday 1pm PT'){
						$sat2++;
					}
				} else {
					if($k == 'Monday 6pm PT'){
						$team2_mon++;
					}
					if($k == 'Tuesday 6pm PT'){
						$team2_tue++;
					}
					if($k == 'Wednesday 6pm PT'){
						$team2_wed++;
					}
					if($k == 'Thursday 6pm PT'){
						$team2_thu++;
					}
					if($k == 'Friday 6pm PT'){
						$team2_fri++;
					}
					if($k == 'Saturday 11am PT'){
						$team2_sat++;
					}
					if($k == 'Saturday 1pm PT'){
						$team2_sat2++;
					}
				}
			}
		}
	}
	$side1_ret = $side1 = [
		'Monday 6pm PT'    => $mon,
		'Tuesday 6pm PT'   => $tue,
		'Wednesday 6pm PT' => $wed,
		'Thursday 6pm PT'  => $thu,
		'Friday 6pm PT'    => $fri,
		'Saturday 11am PT' => $sat,
		'Saturday 1pm PT'  => $sat2,
	];
	$side2_ret = $side2 = [
		'Monday 6pm PT'    => $team2_mon,
		'Tuesday 6pm PT'   => $team2_tue,
		'Wednesday 6pm PT' => $team2_wed,
		'Thursday 6pm PT'  => $team2_thu,
		'Friday 6pm PT'    => $team2_fri,
		'Saturday 11am PT' => $team2_sat,
		'Saturday 1pm PT'  => $team2_sat2,
	];
	uasort($side1, function($a, $b) {
		return ($a > $b) ? -1 : 1;
	});
	uasort($side2, function($a, $b) {
		return ($a > $b) ? -1 : 1;
	});

	$selected_day = '';
	$max_selects = [];
	$best_match = [];
	foreach($side1 as $key => $val){
		//		if($val == 0) continue;
		$_s2v = $side2[$key] ?: 0;
		$max_selects[$key] = $val + $_s2v;
		foreach($side2 as $_key => $_val){
			if($val == $_val && $key == $_key){
				$best_match[$key] = $val + $_val;
			}
		}
	}
	uasort($max_selects, function($a, $b) {
		return ($a > $b) ? -1 : 1;
	});
	uasort($best_match, function($a, $b) {
		return ($a > $b) ? -1 : 1;
	});
	/*
	if(count($max_selects) > 0){
		$selected_day = key($max_selects);
	}
	 */
	$max_count = max($max_selects);
	foreach($max_selects as $_d => $count){
		$selected_day = $_d;
		if(next($max_selects) == $count){
			if(isset($best_match[$_d]) && $count == $best_match[$_d]){
				$selected_day = $_d;
				break;
			}
		}
		break;
	}
	/*
	if($max_count - 5 <= 1 && $max_count - 5 > 0){
		$_d = $count = "";
		$selected_day = '';
		foreach($max_selects as $_d => $count){
			if(isset($best_match[$_d]) && $count == $best_match[$_d]){
				$selected_day = $_d;
				break;
			}
		}
		if($selected_day == ''){
			foreach($max_selects as $_d => $count){
				if(isset($best_match[$_d]) && ($count -1 ) == $best_match[$_d]){
					$selected_day = $_d;
					break;
				}
			}
		}
	}else{
		if($selected_day == '' && key($max_selects) != ""){
			$selected_day = key($max_selects);
		}
		if($max_selects['Monday 6pm PT'] == $max_count){
			$selected_day = 'Monday 6pm PT';
		}
	}
	 */
	if($selected_day == '' && key($max_selects) != ""){
		$selected_day = key($max_selects);
	}
	if($max_selects['Monday 6pm PT'] == $max_count){
		$selected_day = 'Monday 6pm PT';
	}
	if($selected_day == ''){
		$selected_day = 'Monday 6pm PT';
	}
	/*
	print_r($max_selects);
	print_r($best_match);
	echo $selected_day."\r\n";
	 */
	return [$selected_day, $side1_ret, $side2_ret];
}

$force_keys = ['id','first_date','division','match_id','side_1','side_2','team1','team2','selected_day','scheduled'];
$skip_keys = ['region','last_date'];

html_out(
	html_table(obj2arr($matches), $force_keys, $skip_keys)
);
