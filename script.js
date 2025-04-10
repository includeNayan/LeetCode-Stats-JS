document.addEventListener("DOMContentLoaded", function() {
        const Searchbutton = document.getElementById("search");
        const Userinput = document.getElementById("userinput");
        const Statcontainer = document.querySelector(".statcontainer");
        const easycircle = document.querySelector(".easy");
        const medcircle = document.querySelector(".medium");
        const hardcircle = document.querySelector(".hard");
    
        const easyLabel = document.getElementById("easylabel");
        const medLabel = document.getElementById("mediumlabel");
        const hardLabel = document.getElementById("hardlabel");
        const cardstat = document.querySelector(".cardst");
    
        // return true or false based on a regex
        function validate(username) {
            //check for empty string
            if(username.trim() === "") {
                alert("Username should not be empty");
                return false;
            }
            const regex = /^[a-zA-Z0-9_-]{1,15}$/;
            const isMatch = regex.test(username);
            // checking the regex with the username
            if(!isMatch) {
                alert("Invalid Username");
            }
            return isMatch;
        }
    

        async function fetchDetails(username) {
            const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
            try{
                Searchbutton.textContent = "Searching...";
                Searchbutton.disabled = true;
                //demo proxy url will request the lc server and server will acknowledge it
                // const targetUrl = 'https://leetcode.com/graphql/';
                // // concatenated url proxyurl + targeturl
                // const myHeaders = new Headers();
                // myHeaders.append("content-type", "application/json");
    
                // const graphql = JSON.stringify({
                //     query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                //     variables: { "username": `${username}` }
                // })
                // const requestOptions = {
                //     method: "POST", 
                //     headers: myHeaders,
                //     body: graphql,
                //     redirect: "follow"
                // };
                const response = await fetch(url);
                if(!response.ok) {
                    throw new Error("Unable to fetch the user details");
                }
                const parsedData = await response.json();
                if (parsedData.status === "error") {
                    throw new Error("User not found");
                }
                console.log("Logging data: ",parsedData);
                displayData(parsedData);
                Statcontainer.classList.remove("random");
            }
            catch(error) {
                Statcontainer.innerHTML = `<p>No Data Found</p>`;
            }
            finally {
                Searchbutton.textContent = "Search";
                Searchbutton.disabled = false;
            }
        }


        function updateProgress(solved,total,label,circle) {
            const progressDegree = (solved/total)*100;
            circle.style.setProperty("--progress-degree",`${progressDegree}%`);
            label.textContent = `${solved}/${total}`;
    
        }

        function displayData(parsedData) {
            const total = parsedData.totalQuestions;
            const easytotal = parsedData.totalEasy;
            const medtotal = parsedData.totalMedium;
            const hardtotal = parsedData.totalHard;
    
            const soltotal = parsedData.totalSolved;
            const soleasy = parsedData.easySolved;
            const solmed = parsedData.mediumSolved;
            const solhard = parsedData.hardSolved;
            updateProgress(soleasy,easytotal,easyLabel,easycircle);
            updateProgress(solmed,medtotal,medLabel,medcircle);
            updateProgress(solhard,hardtotal,hardLabel,hardcircle);
    
            const cardsData = [
                {label : "Acceptance Rate:", value: parsedData.acceptanceRate},
                {label : "Contribution Points:", value: parsedData.contributionPoints},
                {label : "Global Ranking:", value: parsedData.ranking},
                {label : "Reputations:", value: parsedData.reputation},
            ];
            console.log("Card ka data: ", cardsData);
    
            cardstat.innerHTML = cardsData.map(
                data => `
                    <div class = "card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>
                `
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

    })