<?php
define("primitive",["string","integer","null"]);
define("Alphabets",["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x",
"y","z"]);
//boolean functions
function is_keyable($p_key) :bool{
    return is_primitive($p_key);
}

function is_primitive($data) : bool{
    //returns whether or not a data type is of type [null || string || int]
    return array_find(gettype($data),primitive);
}
function is_empty($data,bool $ignore_space = false) :bool{
    /*returns whether or not a variable is empty, that is either null or an
    empty string, the ignore space parameter specifies whether or not
    a variable with just space characters is considered empty*/
    if(!$data){return true;}
    if(is_primitive($data)){
        $data = (string) $data;
        $data = $ignore_space? preg_replace("/\s/","",$data) : $data;
        return empty($data) && $data != 0;
    }
    return false;
}

function equal_string(string $str1,string $str2) :bool{
    return mb_strtolower($str1) == strtolower($str2);
}
function array_find($string,Array $array) :bool{
    return in_array($string,array_map("mb_strtolower",$array));
}
function single_plural(int $number,string $word){
    if($number < 1){
        return "no $word"."s"; 
    }
    elseif($number < 2){
        return "$number $word";
    }
    else{return "$number $word"."s";}
}
function random_string(int $length = 20){
    $str = "";
    $i = 0;
    while($i < $length){
        //decide whether  character should be a letter or number
        $guess = random_int(1,100);
        if($guess%2 > 0){
            //it should be a number
            $next_char = (string) random_int(0,9);
        }
        else{
            //it should be an alphabet
            $next_char = Alphabets[array_rand(Alphabets)];
        }
        $str .= $next_char;
        $i++;
    }
    return $str;
}
function simple_date(int $timestamp){
    $now = time();
    if($now - $timestamp <= 86400){return "Today";}
}
//html functions
function color_text(string $text,array $colors) :string{
    //loops through $text and apply random colors from $color to them
    $html_text="";
    for($i=0; $i < mb_strlen($text); $i++){
        $char = $text[$i];
        $color = $colors[array_rand($colors)];
        $html_text .=  "<span style='color:$color'>$char</span>";
    }
    return $html_text;
}
function html_input($name,$value,$classes="",$id="",$onclick="") :string{
    $classes = is_empty($classes,true)? "" : "class='$classes'";
    $id = is_empty($id,true)? "" : "id='$id'"; 
    return "<input name='$name' value='$value' $classes $id>";
}
function html_toggle($name="",$value="",$classes="",$id="",$onclick="") :string{
    $default_classes = "toggle-container relative";
    $id = is_empty($id)? "" : "id='$id'";
    $name = is_empty($name)? "" : "name='$name'";
    $value =is_empty($name)? "" : "value='$value'";
    $container = "<span class='$classes $default_classes'>
        <input type='checkbox' class='absolute toggle-input' $id $name $value>
        <span class='round'></span>
    </span>";
    return $container;
}
function html_dropdown($text,$id="",$classes="",string $commands="") :string{
    $id = is_empty($id)? "" : "id='$id'";
    return "<select $id class='drop-down $classes' $commands>
        <option>$text</option>
    </select>
    ";
}
function html_optionicon($id="",$classes="",string $commands="",$title="") :string{
    $id = is_empty($id)? "" : "id='$id'";
    return "<button class='bold option-icon $classes'>&#x2261;</button>";
}
function html_addbutton($id="",$classes="",string $commands="",$title="") :string{
    $id = is_empty($id)? "" : "id='$id'";
    $title = is_empty($title)? "" : "title='$title'";
    return "<button $id class='round flex vcenter hcenter $classes' $title
    $commands>+</button>";
}
function html_backbutton($id="",$classes="",string $commands="") :string{
    $id = is_empty($id)? "" : "id='$id'";
    return "<button class='bold back-btn pointer $classes' $id $commands>
        &#8249;
    </button>";
}

//database functions
function any_result($mysqli_object) :bool{
    return $mysqli_object instanceof mysqli_result;
}
 
//network functions
function custom_session(int $expires,string $path = "/") :void{
    session_set_cookie_params(time() + $expires,$path);
    session_start();
}
function any_session(): bool{
    return isset($_SESSION) && (count($_SESSION) > 0);
}
function redirect(string $url) :void{
    header("location:$url"); 
    die("redirected, if you are still on this page, you might want to
    visit '$url'");
}
function delete_session($key){
    //deletes a session key and destroys the session if no more keys are present
    unset($_SESSION[$key]);
    if(!any_session()){session_destroy();}
}
function location(){
    $location = ["country"=>"Nigeria","continent"=>"Africa","state"=>"Imo state","city"=>"Owerri"];
    return json_encode($location);
}
function device(){
    return "Windows 10 compaq Pc";
}