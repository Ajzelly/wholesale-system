let rating = 0;


document.querySelectorAll(".star").forEach(star=>{

  star.addEventListener("click",()=>{

    rating = star.dataset.val;

    document.querySelectorAll(".star")
      .forEach(s=>s.classList.remove("active"));

    for(let i=0;i<rating;i++){
      document.querySelectorAll(".star")[i]
        .classList.add("active");
    }

  });

});


async function sendFeedback(){

  const user = getUser();

  const msg = document.getElementById("message").value;


  if(!rating || !msg){
    alert("Fill all fields");
    return;
  }


  const res = await fetch("/api/feedback",{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body: JSON.stringify({
      user_id:user.id,
      rating,
      message:msg
    })

  });


  if(res.ok){

    alert("Thank you ❤️");

    location.reload();

  }

}
