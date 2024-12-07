const API_KEY = 'caa80edaff294eca9e94007074c7d393'; // Replace with your Spoonacular or Edamam API key
const API_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

const ingredientInput = document.getElementById('ingredientInput');
const searchButton = document.getElementById('searchButton');
const recipeList = document.getElementById('recipeList');
const recipeDetail = document.getElementById('recipeDetail');
const backButton = document.getElementById('backButton');

// Fetch recipes based on ingredients
const fetchRecipes = async (ingredients) => {
  try {
    const response = await fetch(`${API_URL}?ingredients=${ingredients}&number=5&apiKey=${API_KEY}`);
    const data = await response.json();
    console.log(data); // Debugging: check data
    displayRecipes(data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
};

// Display recipes in search results
const displayRecipes = (recipes) => {
  recipeList.innerHTML = '';
  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.classList.add('recipeCard');
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <button onclick="viewRecipe(${recipe.id})">View Recipe</button>
    `;
    recipeList.appendChild(card);
  });
};

// View recipe details
const viewRecipe = async (id) => {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
    const data = await response.json();
    console.log(data); // Debugging: check detailed recipe data
    showRecipeDetail(data);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
  }
};

// Show recipe details
const showRecipeDetail = (recipe) => {
  document.getElementById('recipeTitle').textContent = recipe.title;
  document.getElementById('recipeImage').src = recipe.image;
  
  // Menggunakan innerHTML untuk merender tag <b> dan elemen HTML lainnya
  document.getElementById('recipeDescription').innerHTML = recipe.summary || 'No description available.';
  
  document.getElementById('cookingTime').innerHTML = `Ready in <b>${recipe.readyInMinutes}</b> minutes`; // Menambahkan bold
  
  document.getElementById('ingredientsList').innerHTML = recipe.extendedIngredients
    ? recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')
    : '<li>No ingredients available.</li>';

  if (recipe.nutrition && recipe.nutrition.nutrients) {
    displayNutritionChart(recipe.nutrition.nutrients);
  } else {
    document.getElementById('nutritionChart').innerHTML = '<p>No nutrition data available.</p>';
  }

  recipeDetail.classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');
};

// Display nutrition chart
const displayNutritionChart = (nutrients) => {
  const ctx = document.createElement('canvas');
  const nutritionChart = document.getElementById('nutritionChart');
  nutritionChart.innerHTML = '';
  nutritionChart.appendChild(ctx);

  const labels = nutrients.map(n => n.name);
  const data = nutrients.map(n => n.amount);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Nutrition Breakdown'
        }
      }
    }
  });
};

// Go back to search results
backButton.addEventListener('click', () => {
  recipeDetail.classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');
});

// Event listener for search button
searchButton.addEventListener('click', () => {
  const ingredients = ingredientInput.value.trim();
  if (ingredients) {
    fetchRecipes(ingredients);
  }
});
