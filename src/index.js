document.addEventListener("DOMContentLoaded", () => {
    const dogForm = document.getElementById("dog-form");
    const tableBody = document.getElementById("table-body");
    let selectedDogId = null;
  
    // Function to fetch dogs from the API and update the table
    function fetchDogs() {
      fetch("http://localhost:3000/dogs")
        .then((response) => response.json())
        .then((dogs) => {
          tableBody.innerHTML = ""; // Clear the table before adding updated data
          dogs.forEach((dog) => {
            const tr = document.createElement("tr");
  
            tr.innerHTML = `
              <td>${dog.name}</td>
              <td>${dog.breed}</td>
              <td>${dog.sex}</td>
              <td><button data-id="${dog.id}" class="edit-btn">Edit</button></td>
            `;
            tableBody.appendChild(tr);
          });
  
          // Add event listeners to the "Edit" buttons
          document.querySelectorAll(".edit-btn").forEach((button) => {
            button.addEventListener("click", handleEditClick);
          });
        });
    }
  
    // Handle the edit button click to populate the form with the dog's data
    function handleEditClick(event) {
      const dogId = event.target.getAttribute("data-id");
  
      fetch(`http://localhost:3000/dogs/${dogId}`)
        .then((response) => response.json())
        .then((dog) => {
          selectedDogId = dog.id;
          dogForm.name.value = dog.name;
          dogForm.breed.value = dog.breed;
          dogForm.sex.value = dog.sex;
        });
    }
  
    // Handle form submission to update the dog details via PATCH request
    dogForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      if (selectedDogId === null) {
        alert("Please select a dog to edit.");
        return;
      }
  
      const updatedDog = {
        name: dogForm.name.value,
        breed: dogForm.breed.value,
        sex: dogForm.sex.value,
      };
  
      fetch(`http://localhost:3000/dogs/${selectedDogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDog),
      })
        .then((response) => response.json())
        .then(() => {
          fetchDogs(); // Re-fetch dogs to update the table
          dogForm.reset(); // Clear the form
          selectedDogId = null; // Reset the selected dog
        });
    });
  
    // Initial fetch to load dogs on page load
    fetchDogs();
  });