
/* Premium flow enhancement */
document.addEventListener("DOMContentLoaded", () => {
  const formSection = document.getElementById("formSection");
  const flowProgress = document.getElementById("flowProgress");
  const personalFields = document.getElementById("personalFields");
  const questionQuick = document.getElementById("questionQuick");
  const message = document.getElementById("message");
  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const choices = document.querySelectorAll(".choice");
  const quickOptions = document.querySelectorAll(".quick-option");

  function setMode(mode){
    const isQuestion = mode === "question" || mode === "price";
    if(personalFields){
      personalFields.classList.toggle("hidden", isQuestion);
      [name, phone, address].forEach(el => { if(el) el.required = !isQuestion; });
    }
    if(questionQuick) questionQuick.classList.toggle("hidden", !isQuestion);
    if(message){
      message.required = isQuestion;
      message.placeholder = isQuestion ? "Write your question here..." : "Write anything else you'd like us to know";
    }
    if(flowProgress) flowProgress.classList.remove("hidden");
  }

  choices.forEach(btn => btn.addEventListener("click", () => {
    setTimeout(() => setMode(btn.dataset.flow), 30);
  }));

  quickOptions.forEach(btn => btn.addEventListener("click", () => {
    if(message){
      message.value = btn.dataset.question || "";
      message.focus();
    }
  }));

  if(formSection){
    const observer = new MutationObserver(() => {
      if(!formSection.classList.contains("hidden")){
        formSection.scrollIntoView({behavior:"smooth", block:"start"});
      }
    });
    observer.observe(formSection,{attributes:true,attributeFilter:["class"]});
  }
});

// Contact settings
const WHATSAPP = "14147328724";
const IMESSAGE = "Elonniriah123@icloud.com";
const EMAIL = "Elontracy50@gmail.com";

const $ = (id) => document.getElementById(id);
const modal = $("welcomeModal");
const continueBtn = $("continueBtn");
const formSection = $("formSection");
const reviewSection = $("reviewSection");
const requestForm = $("requestForm");
const orderFields = $("orderFields");
const formTitle = $("formTitle");
const formDescription = $("formDescription");
const formEyebrow = $("formEyebrow");
const messageLabel = $("messageLabel");
const reviewBox = $("reviewBox");

let flow = "order";
let latestData = {};

function show(el){el.classList.remove("hidden")}
function hide(el){el.classList.add("hidden")}

if(localStorage.getItem("tracyWelcomeSeen")==="1") hide(modal);

continueBtn.addEventListener("click",()=>{
  localStorage.setItem("tracyWelcomeSeen","1");
  hide(modal);
});

document.querySelectorAll(".choice").forEach((button)=>{
  button.addEventListener("click",()=>{
    flow=button.dataset.flow;
    configureForm();
    show(formSection);
    hide(reviewSection);
    formSection.scrollIntoView({behavior:"smooth",block:"start"});
  });
});

function configureForm(){
  const settings={
    order:{title:"Place an Order",description:"Enter the basic request and delivery details. No payment is taken on this website.",eyebrow:"ORDER",fields:true,message:"Additional message"},
    price:{title:"Ask About Price",description:"Send a short request for current pricing and availability.",eyebrow:"PRICE",fields:false,message:"Message"},
    question:{title:"Ask a Question",description:"Ask about the puppies or the adoption process.",eyebrow:"QUESTION",fields:false,message:"Your question"}
  }[flow];

  formTitle.textContent=settings.title;
  formDescription.textContent=settings.description;
  formEyebrow.textContent=settings.eyebrow;
  orderFields.classList.toggle("hidden",!settings.fields);
  messageLabel.firstChild.textContent=settings.message+" ";
  $("message").placeholder=flow==="price"
    ?"Please send me the current price and availability."
    :flow==="question"?"Type your question here":"Write anything else you'd like us to know";
}

requestForm.addEventListener("submit",(event)=>{
  event.preventDefault();
  latestData={
    name:$("name").value.trim(),
    phone:$("phone").value.trim(),
    address:$("address").value.trim(),
    message:$("message").value.trim()
  };

  if(flow==="order"){
    latestData.count=$("puppyCount").value;
    latestData.type=$("puppyType").value.trim()||"Not specified";
    latestData.gender=$("gender").value;
  }

  renderReview();
  hide(formSection);
  show(reviewSection);
  reviewSection.scrollIntoView({behavior:"smooth",block:"start"});
});

function renderReview(){
  const rows=[
    ["Request",flow==="order"?"Place an Order":flow==="price"?"Ask About Price":"Ask a Question"],
    ["Name",latestData.name],
    ["Phone / WhatsApp",latestData.phone],
    ["Delivery address",latestData.address]
  ];

  if(flow==="order"){
    rows.push(["Number of puppies",latestData.count]);
    rows.push(["Puppy / type",latestData.type]);
    rows.push(["Preferred gender",latestData.gender]);
  }

  rows.push(["Message",latestData.message||"None"]);
  reviewBox.innerHTML=rows.map(([label,value])=>
    `<div class="review-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`
  ).join("");
}

function buildMessage(){
  const lines=[
    "Hello, I'm contacting Tracy Chihuahua Puppies for Adoption.",
    "",
    `Request: ${flow==="order"?"Place an Order":flow==="price"?"Ask About Price":"Ask a Question"}`,
    `Name: ${latestData.name}`,
    `Phone/WhatsApp: ${latestData.phone}`,
    `Delivery address: ${latestData.address}`
  ];

  if(flow==="order"){
    lines.push(`Number of puppies: ${latestData.count}`);
    lines.push(`Puppy/type: ${latestData.type}`);
    lines.push(`Preferred gender: ${latestData.gender}`);
  }

  lines.push(`Message: ${latestData.message||"None"}`);
  return lines.join("\n");
}

$("sendWhatsAppBtn").addEventListener("click",()=>{
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(buildMessage())}`,"_blank","noopener");
});

$("sendMessageBtn").addEventListener("click",()=>{
  window.location.href=`sms:${IMESSAGE}?&body=${encodeURIComponent(buildMessage())}`;
});

$("sendEmailBtn").addEventListener("click",()=>{
  const subject=flow==="order"
    ?"Puppy Adoption Order Request"
    :flow==="price"?"Puppy Price & Availability Request":"Puppy Adoption Question";
  window.location.href=`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage())}`;
});

$("editBtn").addEventListener("click",()=>{
  hide(reviewSection);
  show(formSection);
  formSection.scrollIntoView({behavior:"smooth",block:"start"});
});

$("backBtn").addEventListener("click",()=>{
  hide(formSection);
  $("start").scrollIntoView({behavior:"smooth"});
});

$("locationBtn").addEventListener("click",()=>{
  const status=$("locationStatus");
  if(!navigator.geolocation){
    status.textContent="Location is not available on this device. Please enter the address manually.";
    return;
  }
  status.textContent="Requesting your location…";
  navigator.geolocation.getCurrentPosition(
    (position)=>{
      const lat=position.coords.latitude.toFixed(6);
      const lon=position.coords.longitude.toFixed(6);
      $("address").value=`Current location: ${lat}, ${lon} (please confirm the full delivery address)`;
      status.textContent="Location added. Please confirm or replace it with the exact delivery address.";
    },
    ()=>{status.textContent="Location was not provided. Please enter the delivery address manually."}
  );
});

$("year").textContent=new Date().getFullYear();

$("policyLink").addEventListener("click",(event)=>{
  event.preventDefault();
  show($("policy"));
});

$("feedbackLink").addEventListener("click",(event)=>{
  event.preventDefault();
  show($("feedback"));
});

document.querySelectorAll(".close-modal").forEach((button)=>{
  button.addEventListener("click",()=>hide(button.closest(".modal")));
});

$("feedbackForm").addEventListener("submit",(event)=>{
  event.preventDefault();
  const name=$("feedbackName").value.trim()||"Not provided";
  const feedback=$("feedbackText").value.trim();
  const body=encodeURIComponent(`Private website feedback\nName: ${name}\n\n${feedback}`);
  window.open(`https://wa.me/${WHATSAPP}?text=${body}`,"_blank","noopener");
  $("feedbackNote").textContent="Your feedback has been prepared for WhatsApp.";
});

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,(character)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[character]));
}
