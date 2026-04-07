const form=document.getElementById('fitnessForm');
const userIdInput=document.getElementById('userId');
const weightInput=document.getElementById('weight');
const pulseInput=document.getElementById('pulse');
const stepsInput=document.getElementById('steps');
const loadActivityBtn=document.getElementById('loadActivityBtn');
const resultArea=document.getElementById('resultArea');
const activityInfo=document.getElementById('activityInfo');

function renderMessage(type,html){resultArea.className=`result-area ${type}`;resultArea.innerHTML=html;}
function clearMessage(){resultArea.className='result-area';resultArea.textContent='';}
function showActivity(message){activityInfo.classList.remove('hidden');activityInfo.innerHTML=message;}
function hideActivity(){activityInfo.classList.add('hidden');activityInfo.textContent='';}
function parseStrictNumber(raw){if(typeof raw!=='string')return Number.NaN;const trimmed=raw.trim();if(!trimmed)return Number.NaN;return Number(trimmed);}
function validateUserId(){const value=userIdInput.value.trim();if(!/^\d+$/.test(value))throw new Error('ID пользователя должен быть положительным целым числом');const id=Number(value);if(id<=0)throw new Error('ID пользователя должен быть больше 0');return id;}
function validateWeight(){const weight=parseStrictNumber(weightInput.value);if(!Number.isFinite(weight))throw new Error('Вес должен быть числом');if(weight<=0)throw new Error('Вес должен быть больше 0');if(weight<5)throw new Error('Минимальный вес — 5 кг');return weight;}
function validatePulse(currentPulseValue){const pulse=parseStrictNumber(currentPulseValue);if(!Number.isFinite(pulse))throw new Error('Пульс должен быть числом');if(pulse<=0)throw new Error('Пульс должен быть больше 0');return pulse;}
async function loadActivity(){clearMessage();hideActivity();const userId=validateUserId();const response=await fetch(`/api/fitness/activity/${userId}`);const data=await response.json();if(!response.ok)throw new Error(data.message||'Не удалось загрузить активность');stepsInput.value=data.steps;if(!pulseInput.value.trim())pulseInput.value=data.pulse;showActivity(`Загружена активность пользователя <strong>${data.userId}</strong>: шаги — <strong>${data.steps}</strong>, пульс из API — <strong>${data.pulse}</strong>.`);return data;}
loadActivityBtn.addEventListener('click',async()=>{try{await loadActivity();}catch(error){renderMessage('error',error.message);}});
form.addEventListener('submit',async(event)=>{event.preventDefault();clearMessage();try{validateUserId();const weight=validateWeight();if(!stepsInput.value){await loadActivity();}const steps=Number(stepsInput.value);const pulse=validatePulse(pulseInput.value);const response=await fetch('/api/fitness/calories',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({steps,pulse,weight})});const data=await response.json();if(!response.ok)throw new Error(data.message||'Ошибка расчёта калорий');const note=data.doubled?'Коэффициент был удвоен, так как пульс превышает 160 ударов в минуту (Изменение).':'Использован базовый коэффициент 0.04.';renderMessage('success',`<div class="result-main">Сожжено калорий: ${data.calories}</div><div class="result-note">${note}</div>`);}catch(error){renderMessage('error',error.message);}});