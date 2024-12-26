let calorieGoal = 2000;
        let currentCalories = 0;
        let meals = [];

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

                    if (meal && calories > 0) {
                        meals.push({ meal, calories, proteins, carbs, fats });
                        currentCalories += calories;
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

            } 
          
          else if (page === 'dailyReportPage') {
    const report = document.createElement('div');
    report.innerHTML = `<h2>Daily Report</h2>`;

    // Create a table to display meals and their macronutrients
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    // Create table header
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th style="border: 1px solid #ddd; padding: 8px;">Meal</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Calories</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Proteins (g)</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Carbs (g)</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Fats (g)</th>
    `;
    table.appendChild(headerRow);

    // Add each meal to the table
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

    // Append table to report
    report.appendChild(table);

    // Create pie chart container
    const canvas = document.createElement('canvas');
    canvas.id = 'macroPieChart';
    canvas.style.maxWidth = '500px';
    canvas.style.margin = '20px auto';

    

    report.appendChild(canvas);

    // Render pie chart
// Render pie chart
setTimeout(() => {
    const ctx = document.getElementById('macroPieChart').getContext('2d');

    // Calculate the total amounts of each macronutrient
    const totals = meals.reduce((totals, meal) => {
        totals[0] += meal.proteins;  // Proteins
        totals[1] += meal.carbs;     // Carbs
        totals[2] += meal.fats;      // Fats
        return totals;
    }, [0, 0, 0]);

    // Calculate the total of all macronutrients for percentage calculation
    const totalMacronutrients = totals.reduce((sum, value) => sum + value, 0);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Proteins (g)', 'Carbohydrates (g)', 'Fats (g)'],
            datasets: [{
                data: totals, // Use the calculated totals for pie chart data
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
                            size: 15 // Set the font size for legend labels to 17px
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
progressBar.style.marginBottom = '30px';  // Add space below the progress bar

const progressBarInner = document.createElement('div');
progressBarInner.className = 'progress-bar-inner';
progressBarInner.style.width = `${Math.min((currentCalories / calorieGoal) * 100, 100)}%`;

const pointer = document.createElement('div');
pointer.className = 'pointer';
pointer.style.left = `${Math.min((currentCalories / calorieGoal) * 100, 100)}%`;

progressBar.appendChild(progressBarInner);
progressBar.appendChild(pointer);

// Add progress bar with labels on left and right
const calorieLabel = document.createElement('div');
calorieLabel.className = 'calorie-label';
calorieLabel.innerHTML = `<span>${currentCalories} calories consumed</span><span>${calorieGoal} calories</span>`;

report.appendChild(calorieLabel);
report.appendChild(progressBar);

                // Display congratulatory message if goal is achieved
                if (currentCalories >= calorieGoal) {
                    const congratsMessage = document.createElement('p');
                    congratsMessage.style.fontWeight = 'bold';
                    congratsMessage.style.color = '#4caf50';
                    congratsMessage.textContent = 'Congratulations! You achieved your goal';
                    report.appendChild(congratsMessage);
                }
    contentDiv.appendChild(report);
}

          // Add an empty footer for spacing
const footer = document.createElement('div');
footer.style.height = '20px';  // Adjust height to create desired space
report.appendChild(footer);
        }

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




