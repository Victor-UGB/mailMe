document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // send email handler 
  document.querySelector('#compose-form').addEventListener('submit', send_mail);
  // By default, load the inbox
  load_mailbox('inbox');

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function show_mail_list(mailbox){
  const all_sent_mails = []
  const mailboxContainer = document.createElement('div');

  mailboxContainer.id = 'mailBoxListContainer';
  mailboxContainer.innerHTML = `<h1>These are your ${mailbox} mails</h1>`
  

  document.querySelector('#emails-view').append(mailboxContainer)
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach((email) => {
      
      all_sent_mails.push(email)
      console.log(all_sent_mails)
      console.log(emails);
    
      const emailDiv = document.createElement('div');
      emailDiv.className = email['read'] ? "mail-read" : "mail-unread";
      emailDiv.id = "emailDiv"
      emailDiv.innerHTML = `<div class="" style="display: flex; flex-wrap: wrap; border: 1px solid gray; cursor: pointer; margin-top: 1rem;">
      <h5>To: ${email.recipients}</h5>
      <h5>Subject: ${email.subject}</h5>
      <h5>Timestamp: ${email.timestamp}</h5>
      </div>`;
      emailDiv.addEventListener('click', function(){
        open_mail(email.id)
        emailDiv.classList.add("mail-read")
        mailboxContainer.style.display = "none"
        show_mail_details(email.id);

        
      });
      console.log(emails)
      document.querySelector('#mailBoxListContainer').append(emailDiv);
    })
  });

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Show the list of mails in mailbox
  show_mail_list(mailbox)

  //Archived mails
}

function send_mail(e) {
  e.preventDefault()

  const email_reciepient = document.querySelector('#compose-recipients').value;
  const email_subject = document.querySelector('#compose-subject').value;
  const email_body = document.querySelector('#compose-body').value;

  fetch("/emails", {
    method: 'POST',
    body: JSON.stringify({
        recipients : email_reciepient,
        subject: email_subject,
        body: email_body
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    load_mailbox('sent');
  });

}


//Show mail in mailbox


// Function to list of mails any mailbox listed 

// function get_mails(mailbox){
//   mail_list = []
//   fetch(`/emails/${mailbox}`)
//   .then(response => response.json())
//   .then(emails => {
//     emails.forEach((email) => {
//       const singleEmail = email;
//       console.log(singleEmail)
//       mail_list.push(singleEmail)
//       return singleEmail;
//     })
//   })
//   show_mail_details(mailbox);
// }

// Function for the HTML List view of listed

function archive_mail(mail){
  fetch(`emails/${mail.id}`,{
    method : "PUT",
    body: JSON.stringify({
      archived: !mail['archived']
    })
  })
  .then(response => load_mailbox('inbox'));
  console.log(`mail ${mail_id} has been archived`);
}

function show_mail_details(id){
  const mailListDiv = document.createElement('div');
  
  fetch(`emails/${id}`)
  .then(response => response.json())
  .then(mail => {
    
    mailListDiv.innerHTML = `<div>
    <h6>From: ${mail.sender}</h6>
    <h6>Subject: ${mail.subject}</h6>
    <h6>Timestamp: ${mail.timestamp}</h6>
    </div>
    <br>
    <div>
    <p>
    ${mail.body}
    </p>
    <button class="archive_button"></button>
    <button class="reply_button">Reply</button>
    </div>
    `
    mail_archive_button = document.querySelector(".archive_button")
    mail_archive_button.innerHTML = !mail.archived ? 'Archive' : 'Unarchive';
    mail_archive_button.addEventListener('click', function(){
      archive_mail(mail)

      console.log("button clicked");
      console.log(mail)
    });
    mail_reply_button = document.querySelector(".reply_button")
    mail_reply_button.addEventListener('click', function(){
      compose_email();

      document.querySelector('#compose-recipients').value = mail.sender;
      let subject = mail.subject;
      if(subject.split('', 1)){
        subject = "Re: " + mail.subject;
      }
      document.querySelector('#compose-subject').value = subject;
      document.querySelector('#compose-body').value = `On ${mail.timestamp}`;

    })
  });
  console.log("showing mail details...")
  document.querySelector("#emails-view").append(mailListDiv);
}

// Function for opened mails
function open_mail(mail_id){
  fetch(`emails/${mail_id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true
    })
  })
  .then(response => response.json())
  .then(mail => {
    console.log(mail);
  });

// function opened_mail(mailbox){
//   fetch(`emails/${mailbox}`)
//   .then(response => response.json())
//   .then((mail) => {
//     if(mail.read = true){

//     }
//   })
// }

  
  // .then(response => response.json)
  // .then((data) => {
  //   if(data.read = true){
  //     mail.classList.add("mail-read")
  //   }else{      
  //   }
  // })
  
}

// function show_mail_details(id){
//   fetch(`emails/${id}`)
//   .then(response => response.json())
//   .then(email => {

//   })
//   get_mails(mailbox)
//   mail_list.forEach((mail) => {
//     const mailListDiv = document.createElement('div');
//     mailListDiv.innerHTML = `<div>
//     <h8>${mail.sender}</h8>
//     <h8>${mail.subject}</h8>
//     <h8>${mail.timestamp}</h8>
//     </div>`
    
//   });
//   document.getElementById("#emails-view").append(mailListDiv)
//   console.log(`This is a single mail ${singleEmail}`);
// }