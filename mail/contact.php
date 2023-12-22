<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'Exception.php';
require 'PHPMailer.php';



function sendEmail() {
        $mail = new PHPMailer;
        if(empty($_POST['name'])  || empty($_POST['phone']) || empty($_POST['message'])  ||  !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            return array(
              'status' => 'error',
              'message' => 'Message could not be sent.',
              'error' => 'validation Error'
            );
         }
      $mail->From = 'info@kuberawoods.com';
      $mail->FromName = 'Mailer';
      $mail->addAddress('joy.dmello554@gmail.com');
      $mail->isHTML(false); 


      $name = strip_tags(htmlspecialchars($_POST['name']));
      $email = strip_tags(htmlspecialchars($_POST['email']));
      $phone = strip_tags(htmlspecialchars($_POST['phone']));
      $message = strip_tags(htmlspecialchars($_POST['message']));
      
      $mail->Subject = "Quote For :  $name";
      $mail->Body   = "You have received a new message from your website contact form.\n\n";
      $mail->Body .= "Here are the details:\n\nName: $name\nEmail: $email\nPhone: $phone\nRemarks: $message";
    
      if(!$mail->send()) {
        return array(
          'status' => 'error',
          'message' => 'Message could not be sent.',
          'error' => 'Mailer Error: ' . $mail->ErrorInfo
        );
      } else {
          return array(
          'status' => 'success',
          'message' => 'Message has been sent.'
        );
      }
}

function sendJsonResponse($data) {
	header('Content-type: application/json');
	die(json_encode($data));
}

if(isset($_POST) && !empty($_POST)) {
	$response = sendEmail();
	sendJsonResponse($response);
}
?>