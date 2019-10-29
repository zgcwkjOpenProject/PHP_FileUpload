<?php

header('Content-type:text/json'); // 规定返回的内容是Json数据
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $jaonDataName = 'files/data.json';
    // 文件存储位置
    $filePath = getPath();
    // 从文件中读取数据到PHP变量
    $json_string = file_get_contents($jaonDataName);
    // 把JSON字符串转成PHP数组
    $datas = json_decode($json_string, true);
    // 显示出来看看
    // echo var_dump($datas);
    if (isset($_REQUEST['key'])) {
        foreach ($datas as $key => $value) {
            if (in_array($_REQUEST['key'], $value)) {
                echo json_encode([
                    'status'  => 0,
                    'message' => $value
                ]);
                exit();
            }
        }
        echo json_encode([
            'status'  => 1,
            'message' => '文件不存在'
        ]);
    } else {
        //保存上传的文件
        $return = saveFile($filePath);
        //文件保存成功
        if ($return['status'] == 0) {
            $name = isset($_POST['name']) ? trim($_POST['name']) : '';
            // 添加新的数据
            array_push($datas, array('key' => $return['key'], 'value' => $filePath . DIRECTORY_SEPARATOR . $return['name']));
            // 把PHP数组转成JSON字符串
            $json_string = json_encode($datas);
            // 写入文件
            file_put_contents($jaonDataName, $json_string);
        }
        // 输出到界面
        echo json_encode($return);
    }
}

/**
 * 获取存储的文件目录
 * @return string
 */
function getPath()
{
    ini_set('date.timezone', 'Asia/Shanghai'); // 设置时区
    $path = 'files' . DIRECTORY_SEPARATOR . date('Ymd', time());
    if (!is_dir($path)) mkdir($path);
    return $path;
}

/**
 * 保存上传的文件到一个目录
 *
 * @param string $dir
 * @param string $dest
 * @return array
 */
function saveFile($dir, $dest = '')
{
    $sum = isset($_POST['sum']) ? trim($_POST['sum']) : '';
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $index = isset($_POST['index']) ? intval($_POST['index']) : 0;
    $count = isset($_POST['count']) ? intval($_POST['count']) : 0;

    //禁止上传文件类型
    if ((strpos($name, '.php') || strpos($name, '.html')) !== false) {
        return array(
            'status' => 1,
            'message'   => '该类型文件禁止上传'
        );
    }

    if (empty($sum) || empty($name) || $index < 0 || $index >= $count) {
        return array(
            'status' => 1,
            'message'   => false
        );
    }

    if ($_FILES['data']['error'] > 0) {
        return array(
            'status'  => $_FILES['data']['error'],
            'message' => getErrorMessage($_FILES['data']['error'])
        );
    }

    $dest = empty($dest) ? $name : $dest;
    $dest = $dir . DIRECTORY_SEPARATOR . $dest;
    if (file_exists($dest)) {
        return array(
            'status'  => 2,
            'message' => '同名文件已经存在'
        );
    }

    copy($_FILES['data']['tmp_name'], sys_get_temp_dir() . DIRECTORY_SEPARATOR . $sum . '-' . $index);

    if ($index + 1 == $count) {
        $fd = fopen($dest, 'x');
        if (false === $fd && !flock($fd, LOCK_EX)) {
            return array(
                'status'  => 1,
                'message' => '打开文件失败'
            );
        }

        for ($i = 0; $i < $count; $i++) {
            $tmp = sys_get_temp_dir() . DIRECTORY_SEPARATOR . $sum . '-' . $i;
            fwrite($fd, file_get_contents($tmp));
            unlink($tmp);
        }

        flock($fd, LOCK_UN);
        fclose($fd);
    }

    return array(
        'name'   => $name,
        'key'   => md5_file($dest),
        'status' => 0,
        'message'   => $index + 1 == $count
    );
}

/**
 * 根据错误代码获取错误信息
 *
 * @param int $code
 * @return string
 */
function getErrorMessage($code)
{
    switch ($code) {
        case UPLOAD_ERR_OK:
        case UPLOAD_ERR_FORM_SIZE:
            return '文件块太大';
            break;
        case UPLOAD_ERR_PARTIAL:
            return '文件没有完整上传';
            break;
        case UPLOAD_ERR_NO_FILE:
            return '文件没有上传';
            break;
        case UPLOAD_ERR_NO_TMP_DIR:
            return '找不到临时文件夹';
            break;
        case UPLOAD_ERR_CANT_WRITE:
            return '文件写入失败';
            break;
        default:
            return '未知错误';
            break;
    }
}
