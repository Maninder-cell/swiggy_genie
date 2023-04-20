<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\User;
use Validator;
use JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Mail;
use Illuminate\Support\Facades\URL;


class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','register','forgetPassword','setPassword','updatePassword']]);
    }
    function register(Request $req){

        $rules = array(
            'first_name'=>'required|string',
            'email'=>'required|email|unique:users',
            'password'=>'required|min:6'
        );
    
        $validator = Validator::make($req->all(),$rules);
        
        if($validator->fails()){
            return $validator->errors();
        }


        $user = new User;
        $user->first_name = $req->first_name;
        $user->last_name = $req->last_name;
        $user->email = $req->email;
        $user->password = Hash::make($req->password);
        $user->save();

        $token = JWTAuth::fromUser($user);
        return response()->json(['status'=>'ok','msg'=>'Registration successful','data'=>$user,'token'=>$token]);
    }

    function login(Request $req){
        $rules = array(
            'email'=>'required|email',
            'password'=>'required|min:6'
        );
    
        $validator = Validator::make($req->all(),$rules);
        
        if($validator->fails()){
            return $validator->errors();
        }

        $check = User::where('email',$req->email)->first();
        if(!$check){
            return response()->json(['msg'=>'Invalid Credentials']);
        }

        $userpass = Hash::check($req->password,$check->password);
        if(!$userpass){
            return response()->json(['msg'=>'Invalid Credentials']);    
        }

        $token = JWTAuth::fromUser($check);
            return response()->json(['status'=>'ok','msg'=>'Login successful','data'=>$check,'token'=>$token]);

    }

    function forgetPassword(Request $req){
        $rules = array(
            'email'=>'required|email'
        );
    
        $validator = Validator::make($req->all(),$rules);
        
        if($validator->fails()){
            return $validator->errors();
        }

        $user = User::where('email',$req->email)->first();
        if(!$user){
            return response()->json(['msg'=>"User doesn't exist"]);
        }
        $token = JWTAuth::fromUser($user);

        $addr = URL::to('/api');
        $url = $addr.'/updatepassword/'.$token;

        $data = [
            'url'=>$url,
            'subject'=>'Reset Password',
            'email'=>$req->email,
            'body'=>'Click link to reset password'
        ];

        $mail = Mail::send('mail',$data,function($message) use ($data){
            $message->to($data['email']);
            $message->subject($data['subject']);
        });

        if($mail){
            return response()->json(['msg'=>"Reset Password sent succesfully to your mail id"]);
        }
        return response()->json(['msg'=>"Unable to sent mail"]);

    }

    function updatePassword($token){
        $user = JWTAuth::parseToken($token)->authenticate();

        if(!$user){
            return response()->json(["msg"=>"Link expires"]);
        }

        return view('update',['user'=>$user]);
    }

    function setPassword(Request $req){
        $user = User::find($req->id);
        if(!$user){
            return response()->json(["msg"=>"User not found"]);
        }
        if($req->password == $req->password){
            $user->password = Hash::make($req->password);
            $user->save();
            return response()->json(["success"=>"true","msg"=>"Password Updated Succesfully","user"=>$user]);
        }
        else{
        return response()->json(["msg"=>"Password and confirm Password doesn't match"]);
        }
    }
   
}


