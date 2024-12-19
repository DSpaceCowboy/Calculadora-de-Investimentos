function calcularInvestimento() {
    const capitalInicial = parseFloat(document.getElementById('capital-inicial').value);
    const aportePeriodico = parseFloat(document.getElementById('aporte-periodico').value);
    const tempo = parseInt(document.getElementById('tempo').value);
    const taxaAplicacao = parseFloat(document.getElementById('taxa-aplicacao').value) / 100;
    const taxaIPCA = parseFloat(document.getElementById('taxa-ipca').value) / 100;

    let montanteAplicacao = capitalInicial;
    let montanteIPCA = capitalInicial;
    let resultadosAplicacao = [montanteAplicacao];
    let resultadosIPCA = [montanteIPCA];

    for (let ano = 1; ano <= tempo; ano++) {
        montanteAplicacao = montanteAplicacao * (1 + taxaAplicacao);
        montanteAplicacao += aportePeriodico;
        resultadosAplicacao.push(montanteAplicacao);
    
        montanteIPCA = montanteIPCA * (1 + taxaIPCA);
        montanteIPCA += aportePeriodico;
        resultadosIPCA.push(montanteIPCA);
    }

    const montanteFinal = montanteAplicacao;
    const montanteFinalIPCA = montanteIPCA;
    const diferenca = montanteFinal - montanteFinalIPCA;

    document.getElementById('resultado').innerHTML = `
        Montante Final com Taxa de Aplicação: R$ ${montanteFinal.toFixed(2)}<br>
        Montante Final com IPCA: R$ ${montanteFinalIPCA.toFixed(2)}<br>
        Diferença: R$ ${diferenca.toFixed(2)}
    `;


    const ctx = document.getElementById('grafico').getContext('2d');
    if (window.chart) {
        window.chart.data.labels = Array.from({ length: tempo + 1 }, (_, i) => i); // Labels divididos ao longo do tempo
        window.chart.data.datasets[0].data = resultadosAplicacao;
        window.chart.data.datasets[1].data = resultadosIPCA;
        window.chart.update();
    } else {
        window.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: tempo + 1 }, (_, i) => i), // Labels divididos ao longo do tempo
                datasets: [
                    {
                        label: 'Montante com Taxa de Aplicação',
                        data: resultadosAplicacao,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false,
                    },
                    {
                        label: 'Montante com IPCA',
                        data: resultadosIPCA,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: false,
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Ano'
                        },
                        // Ajustar o intervalo dos ticks para refletir a divisão do tempo
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Montante (R$)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Adicionar o evento de input para recalcular sempre que houver uma mudança
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calcularInvestimento);
});

// Calcular o investimento ao carregar a página
window.onload = calcularInvestimento;
