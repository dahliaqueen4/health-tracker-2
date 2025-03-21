let calorieGoal = 3000;
let currentCalories = 0;
let meals = [];
let days = []; // Added to track daily data

// Save data to localStorage
function saveData() {
    localStorage.setItem('calorieGoal', calorieGoal);
    localStorage.setItem('currentCalories', currentCalories);
    localStorage.setItem('meals', JSON.stringify(meals));
    localStorage.setItem('days', JSON.stringify(days)); // Save days data
}

// Load data from localStorage
function loadData() {
    const savedCalorieGoal = localStorage.getItem('calorieGoal');
    const savedCurrentCalories = localStorage.getItem('currentCalories');
    const savedMeals = localStorage.getItem('meals');
    const savedDays = localStorage.getItem('days'); // Load days data

    if (savedCalorieGoal) calorieGoal = parseInt(savedCalorieGoal);
    if (savedCurrentCalories) currentCalories = parseInt(savedCurrentCalories);
    if (savedMeals) meals = JSON.parse(savedMeals);
    if (savedDays) days = JSON.parse(savedDays); // Parse days data
}

// Call loadData when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

// Download data as a JSON file
function downloadData() {
    const data = {
        calorieGoal,
        currentCalories,
        meals,
        days // Include days data in the download
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'nutrition_data.json';
    a.click();

    URL.revokeObjectURL(url);
}

// Validate input
function validateInput(input, type) {
    if (type === 'text' && !/^[A-Za-z\s]+$/.test(input)) {
        alert('Invalid input: Meal name should only contain letters and spaces.');
        return false;
    }
    if (type === 'number' && isNaN(input)) {
        alert('Invalid input: Please enter a valid number.');
        return false;
    }
    return true;
}

// Reset daily data for a new day
function resetDailyData() {
    currentCalories = 0;
    meals = [];
    saveData();
}

// Clear confetti
function clearConfetti() {
    const confettiElement = document.getElementById('confetti');
    confettiElement.innerHTML = ''; // Remove all confetti pieces
}

function navigateToPage(page) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    if (page === 'setGoalPage') {
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Enter your calorie goal';
        const button = document.createElement('button');
        button.textContent = 'Set Goal';
        button.onclick = () => {
            const goal = parseInt(input.value);
            if (goal && goal > 0) {
                calorieGoal = goal;
                resetDailyData(); // Reset daily data when a new goal is set
                clearConfetti(); // Clear confetti when a new goal is set
                days.push({ date: new Date().toLocaleDateString(), meals: [], totalCalories: 0 }); // Add a new day
                saveData();
                alert(`Calorie goal set to ${calorieGoal} calories.`);
            }
        };
        contentDiv.appendChild(input);
        contentDiv.appendChild(button);

    } else if (page === 'logMealPage') {
        const mealInput = document.createElement('input');
        mealInput.type = 'text';
        mealInput.placeholder = 'Meal name';

        const calorieInput = document.createElement('input');
        calorieInput.type = 'number';
        calorieInput.placeholder = 'Calories';

        const proteinInput = document.createElement('input');
        proteinInput.type = 'number';
        proteinInput.placeholder = 'Proteins (g)';

        const carbInput = document.createElement('input');
        carbInput.type = 'number';
        carbInput.placeholder = 'Carbs (g)';

        const fatInput = document.createElement('input');
        fatInput.type = 'number';
        fatInput.placeholder = 'Fats (g)';

        const button = document.createElement('button');
        button.textContent = 'Log Meal';
        button.onclick = () => {
            const meal = mealInput.value;
            const calories = parseInt(calorieInput.value);
            const proteins = parseInt(proteinInput.value) || 0;
            const carbs = parseInt(carbInput.value) || 0;
            const fats = parseInt(fatInput.value) || 0;

            if (!validateInput(meal, 'text') || !validateInput(calories, 'number')) {
                return;
            }

            if (meal && calories > 0) {
                meals.push({ meal, calories, proteins, carbs, fats });
                currentCalories += calories;
                days[days.length - 1].meals.push({ meal, calories, proteins, carbs, fats }); // Add meal to current day
                days[days.length - 1].totalCalories += calories; // Update total calories for the day
                saveData();
                alert(`${meal} logged with ${calories} calories.`);

                if (currentCalories >= calorieGoal) {
                    launchConfetti();
                }
            }
        };

        contentDiv.appendChild(mealInput);
        contentDiv.appendChild(calorieInput);
        contentDiv.appendChild(proteinInput);
        contentDiv.appendChild(carbInput);
        contentDiv.appendChild(fatInput);
        contentDiv.appendChild(button);

    } else if (page === 'dailyReportPage') {
        const report = document.createElement('div');
        report.innerHTML = `<h2 style="text-align: center; margin-top: 50px; margin-bottom: 20px;">Daily Report</h2>`;

        // Create a table to display meals and their macronutrients
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '45px';

        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th style="border: 1px solid #ddd; padding: 8px;">Meal</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Calories</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Proteins (g)</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Carbs (g)</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Fats (g)</th>
        `;
        table.appendChild(headerRow);

        meals.forEach(meal => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="border: 1px solid #ddd; padding: 8px;">${meal.meal}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${meal.calories}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${meal.proteins}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${meal.carbs}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${meal.fats}</td>
            `;
            table.appendChild(row);
        });

        report.appendChild(table);

        const pieChartHeading = document.createElement('h3');
        pieChartHeading.textContent = 'Macronutrients Pie Chart';
        pieChartHeading.style.textAlign = 'center';
        pieChartHeading.style.marginTop = '30px';
        report.appendChild(pieChartHeading);

        const canvas = document.createElement('canvas');
        canvas.id = 'macroPieChart';
        canvas.style.maxWidth = '500px';
        canvas.style.margin = '20px auto';
        report.appendChild(canvas);

        setTimeout(() => {
            const ctx = document.getElementById('macroPieChart').getContext('2d');
            const totals = meals.reduce((totals, meal) => {
                totals[0] += meal.proteins;
                totals[1] += meal.carbs;
                totals[2] += meal.fats;
                return totals;
            }, [0, 0, 0]);

            const totalMacronutrients = totals.reduce((sum, value) => sum + value, 0);

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Proteins (g)', 'Carbohydrates (g)', 'Fats (g)'],
                    datasets: [{
                        data: totals,
                        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 15
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    const value = tooltipItem.raw;
                                    const percentage = ((value / totalMacronutrients) * 100).toFixed(2);
                                    return `${tooltipItem.label}: ${value}g (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }, 0);

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.marginBottom = '30px';

        const progressBarInner = document.createElement('div');
        progressBarInner.className = 'progress-bar-inner';
        progressBarInner.style.width = `${Math.min((currentCalories / calorieGoal) * 100, 100)}%`;

        const pointer = document.createElement('div');
        pointer.className = 'pointer';
        pointer.style.left = `${Math.min((currentCalories / calorieGoal) * 100, 100)}%`;

        progressBar.appendChild(progressBarInner);
        progressBar.appendChild(pointer);

        const calorieLabel = document.createElement('div');
        calorieLabel.className = 'calorie-label';
        calorieLabel.innerHTML = `<span>${currentCalories} calories consumed</span><span>${calorieGoal} calories</span>`;

        report.appendChild(calorieLabel);
        report.appendChild(progressBar);

        if (currentCalories >= calorieGoal) {
            const congratsMessage = document.createElement('p');
            congratsMessage.style.fontWeight = 'bold';
            congratsMessage.style.color = '#4caf50';
            congratsMessage.textContent = 'Congratulations! You achieved your goal';
            report.appendChild(congratsMessage);
        }

        const footer = document.createElement('div');
        footer.style.height = '20px';
        report.appendChild(footer);

        contentDiv.appendChild(report);

        const trendHeading = document.createElement('h3');
        trendHeading.textContent = 'Calorie Consumption Trends';
        trendHeading.style.marginTop = '30px';
        contentDiv.appendChild(trendHeading);
        trendHeading.style.textAlign = 'center';

        renderCalorieTrendChart();

        const customLegend = document.createElement('p');
        customLegend.innerHTML = '✔ Checkmark means the calorie goal was reached for that day.';
        customLegend.style.marginTop = '10px';
        contentDiv.appendChild(customLegend);
    }
}

 function renderCalorieTrendChart() {
            const ctx = document.createElement('canvas');
            ctx.id = 'calorieTrendChart';
            ctx.style.maxWidth = '1000px';
            ctx.style.height = '400px';
            ctx.style.margin = '20px auto';

            const report = document.getElementById('content');
            report.appendChild(ctx);

            const labels = days.map((day, index) => `Day ${index + 1} (${day.date})`); // Include date in labels
            const data = days.map(day => day.totalCalories); // Use total calories for each day
            const goalMet = data.map(calories => calories >= calorieGoal);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Calorie Intake',
                        data: data,
                        borderColor: '#36A2EB',
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Calories'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Days'
                            }
                        }
                    },
                    plugins: {
                        annotation: {
                            annotations: goalMet.map((met, index) => ({
                                type: 'label', // Use 'label' instead of 'point'
                                xValue: index, // X-axis position (day index)
                                yValue: data[index], // Y-axis position (calories for the day)
                                content: met ? '✔' : '', // Display checkmark if goal is met
                                font: {
                                    size: 20, // Adjust font size
                                    weight: 'bold'
                                },
                                color: '#4caf50', // Green color for the checkmark
                                backgroundColor: 'transparent',
                                borderWidth: 0,
                                position: 'top' // Position the checkmark above the point
                            }))
                        }
                    }
                }
            });
        }



// Launch confetti
function launchConfetti() {
    const confettiElement = document.getElementById('confetti');
    for (let i = 0; i < 100; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.style.position = 'absolute';
        confettiPiece.style.top = `${Math.random() * 100}%`;
        confettiPiece.style.left = `${Math.random() * 100}%`;
        confettiPiece.style.width = '10px';
        confettiPiece.style.height = '10px';
        confettiPiece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confettiPiece.style.animation = `fall ${Math.random() * 5 + 3}s linear infinite`;

        confettiElement.appendChild(confettiPiece);
    }
}


