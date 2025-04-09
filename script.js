document.addEventListener("DOMContentLoaded",function() {
    document.addEventListener("DOMContentLoaded", function() {
        const Searchbutton = document.getElementById("search");
        const Userinput = document.getElementById("userinput");
        const Statcontainer = document.querySelector("statcontainer");
        const easycircle = document.querySelector("easy");
        const medcircle = document.querySelector("medium");
        const hardcircle = document.querySelector("hard");
    
        const easyLabel = document.getElementById("easylabel");
        const medLabel = document.getElementById("mediumlabel");
        const hardLabel = document.getElementById("hardlabel");
        const cardstat = document.querySelector("card");
    
        // return true or false based on a regex
        function validate(username) {
            //check for empty string
            if(username.trim() === "") {
                alert("Username should not be empty");
                return false;
            }
            const regex = /^[a-zA-Z0-9_-]{1,20}$/;
            const isMatch = regex.test(username);
            // checking the regex with the username
            if(!isMatch) {
                alert("Invalid Username");
            }
            return isMatch;
        }
    

        async function fetchDetails(username) {
            try{
                Searchbutton.textContent = "Searching...";
                Searchbutton.disabled = true;
                //demo proxy url will request the lc server and server will acknowledge it
                const proxyUrl = 'http://localhost:8080/';
                const targetUrl = 'https://leetcode.com/graphql/';
                // concatenated url proxyurl + targeturl
                const myHeaders = new Headers();
                myHeaders.append("content-type", "application/json");
    
                const graphql = JSON.stringify({
                    query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                    variables: { "username": `${username}` }
                })
                const requestOptions = {
                    method: "POST", 
                    headers: myHeaders,
                    body: graphql,
                    redirect: "follow"
                };
                const response = await fetch(proxyUrl+targetUrl,requestOptions);
                if(!response.ok) {
                    throw new Error("Unable to fetch the user details");
                }
                const parsedData = await response.json();
                console.log("Logging data: ",parsedData);
                displayData(parsedData);
                statscnt.classList.remove("random");
            }
            catch(error) {
                statscnt.innerHTML = `<p>No Data Found</p>`;
            }
            finally {
                Searchbutton.textContent = "Search";
                Searchbutton.disabled = false;
            }
        }


        function displayData(parsedData) {
            const total = parsedData.data.allQuestionsCount[0].count;
            const easytotal = parsedData.data.allQuestionsCount[1].count;
            const medtotal = parsedData.data.allQuestionsCount[2].count;
            const hardtotal = parsedData.data.allQuestionsCount[3].count;
    
            const soltotal = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
            const soleasy = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
            const solmed = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
            const solhard = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;
            updateProgress(soleasy,easytotal,easyLabel,easyCircle);
            updateProgress(solmed,medtotal,medLabel,medCircle);
            updateProgress(solhard,hardtotal,hardLabel,hardCircle);
    
            const cardsData = [
                {label : "Overall Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
                {label : "Overall Easy Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
                {label : "Overall Medium Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
                {label : "Overall Hard Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions},
            ];
            console.log("Card ka data: ", cardsData);
    
            cardstatscnt.innerHTML = cardsData.map(
                data => {
                    return `
                    <div class = "card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
                }
            ).join("")
    
        }

        Searchbutton.addEventListener('click', function() {
            const username = Userinput.value;
            console.log("Login Username: ",username);
            if(validate(username)) {
                // is the name in the database or not
                fetchDetails(username);
            }
        })


    
//         function updateProgress(solved,total,label,circle) {
//             const progressDegree = (solved/total)*100;
//             circle.style.setProperty("--progress-degree",`${progressDegree}%`);
//             label.textContent = `${solved}/${total}`;
    
//         }
    
    
    })
})