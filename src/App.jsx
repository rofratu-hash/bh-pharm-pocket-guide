import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, ClipboardCheck, Pill, Brain, FileText, ShieldAlert, HeartPulse, FlaskConical, Star, StarOff, AlertTriangle, Stethoscope, Activity, Calculator } from 'lucide-react';
import './style.css';

const meds = [
  {name:'Clozapine',class:'Atypical antipsychotic',category:'Antipsychotic',tags:['REMS','ANC','metabolic','seizure risk','constipation'],pearls:['Reserve for treatment-resistant schizophrenia or recurrent suicidal behavior in schizophrenia/schizoaffective disorder.','ANC monitoring is essential; confirm current REMS/facility process before dispensing.','Major risks: agranulocytosis, myocarditis, seizures, severe constipation/ileus, orthostasis, sedation, metabolic effects.','Smoking changes can alter levels; stopping smoking may increase clozapine exposure.'],monitoring:['ANC','A1c/glucose','lipids','weight/BMI','bowel function','sedation/orthostasis','HR/chest pain/fever early in therapy'],redFlags:['fever','chest pain','severe constipation','syncope','seizure','ANC issue'],note:'Recommend verifying ANC eligibility and bowel regimen, and monitoring for sedation, orthostasis, metabolic effects, and signs of myocarditis during early therapy.'},
  {name:'Lithium',class:'Mood stabilizer',category:'Mood Stabilizer',tags:['level','renal','thyroid','toxicity'],pearls:['Narrow therapeutic index; levels must be interpreted with timing and clinical status.','Toxicity risk increases with dehydration, renal impairment, NSAIDs, ACE inhibitors/ARBs, and some diuretics.','Assess tremor, GI symptoms, confusion, ataxia, polyuria/polydipsia.'],monitoring:['Lithium level','SCr/eGFR','TSH','calcium','pregnancy status when relevant','hydration/sodium intake','drug interactions'],redFlags:['ataxia','confusion','vomiting/diarrhea','new NSAID','AKI/dehydration'],note:'Recommend checking lithium level with renal and thyroid monitoring, reviewing interacting medications, and assessing for clinical signs of lithium toxicity.'},
  {name:'Valproate / Divalproex',class:'Mood stabilizer / anticonvulsant',category:'Mood Stabilizer',tags:['level','LFT','platelets','teratogenicity'],pearls:['Commonly used for bipolar mania and agitation-related mood instability.','Watch for hepatotoxicity, pancreatitis, thrombocytopenia, sedation, tremor, weight gain.','High-risk in pregnancy; confirm facility policy for counseling/documentation.'],monitoring:['Valproate level','LFTs','CBC/platelets','weight','sedation','tremor','pregnancy considerations'],redFlags:['abdominal pain','marked sedation','platelet drop','LFT elevation','pregnancy risk'],note:'Recommend valproate level, LFTs, CBC/platelets, and assessment for sedation, tremor, weight gain, and pregnancy-related risk where applicable.'},
  {name:'Carbamazepine',class:'Mood stabilizer / anticonvulsant',category:'Mood Stabilizer',tags:['CYP inducer','CBC','LFT','sodium','rash'],pearls:['Major interaction burden due to enzyme induction.','Watch for rash, hyponatremia, hepatotoxicity, blood dyscrasias, and CNS effects.','Medication reconciliation is especially important when added or stopped.'],monitoring:['CBC','LFTs','sodium','drug interactions','rash','sedation/dizziness','level if clinically indicated'],redFlags:['rash','fever','sore throat','low sodium','interaction cascade'],note:'Recommend CBC, LFTs, sodium monitoring, and a focused interaction review due to carbamazepine enzyme induction and safety risks.'},
  {name:'Lamotrigine',class:'Mood stabilizer / anticonvulsant',category:'Mood Stabilizer',tags:['rash','SJS','slow titration','valproate interaction'],pearls:['Requires slow titration to reduce serious rash risk.','Valproate substantially affects lamotrigine dosing/titration strategy.','If several doses are missed, restart/titration rules may apply per policy and labeling.'],monitoring:['rash','titration schedule','missed doses','valproate interaction','patient education'],redFlags:['rash','mucosal lesions','fever','recent restart','rapid titration'],note:'Recommend confirming lamotrigine titration schedule, missed-dose history, and rash monitoring, especially with concurrent valproate or recent interruption.'},
  {name:'Haloperidol',class:'Typical antipsychotic',category:'Antipsychotic',tags:['EPS','QT','agitation','NMS'],pearls:['Useful for acute agitation but higher EPS risk than many atypicals.','Assess cumulative antipsychotic burden when scheduled and PRN agents overlap.','QT risk increases with high doses, electrolyte abnormalities, and other QT-prolonging drugs.'],monitoring:['EPS','akathisia','QT/EKG risk','K/Mg','sedation','NMS symptoms','duplicate antipsychotics'],redFlags:['rigidity/fever','new dystonia','high QT burden','frequent PRN use','low K/Mg'],note:'Recommend evaluating EPS and QT risk, especially with high cumulative antipsychotic exposure, electrolyte abnormalities, or concurrent QT-prolonging medications.'},
  {name:'Risperidone',class:'Atypical antipsychotic',category:'Antipsychotic',tags:['prolactin','EPS','LAI','metabolic'],pearls:['Dose-related EPS and prolactin effects can occur.','Review renal function for dosing considerations.','May be used orally or as LAI depending on formulation and facility protocol.'],monitoring:['EPS','prolactin symptoms','A1c/glucose','lipids','weight/BMI','renal function','adherence'],redFlags:['galactorrhea','sexual dysfunction','EPS','renal impairment','LAI timing issue'],note:'Recommend monitoring for EPS, prolactin-related adverse effects, metabolic parameters, and renal-dose considerations.'},
  {name:'Paliperidone LAI',class:'Atypical antipsychotic LAI',category:'LAI',tags:['LAI','renal','prolactin','metabolic','missed dose'],pearls:['Confirm exact LAI product because monthly, 3-month, and 6-month products have different rules.','Renal function matters for paliperidone dosing/product suitability.','Verify last injection date, site, dose, and loading/maintenance status.'],monitoring:['last injection date','dose/product','renal function','EPS','prolactin symptoms','metabolic labs','missed-dose protocol'],redFlags:['unknown last dose','wrong product interval','renal impairment','missed loading dose'],note:'Recommend verifying paliperidone LAI product, last injection date, renal function, and missed-dose/loading requirements before administration.'},
  {name:'Aripiprazole LAI',class:'Atypical antipsychotic LAI',category:'LAI',tags:['LAI','oral overlap','akathisia','missed dose'],pearls:['Confirm exact LAI product because initiation and oral overlap requirements differ.','Akathisia can be clinically significant and may look like anxiety/agitation.','Verify last injection date and missed-dose instructions.'],monitoring:['last injection date','oral overlap','akathisia','activation/insomnia','metabolic labs','missed-dose protocol'],redFlags:['no oral overlap when required','severe akathisia','unclear product','missed dose'],note:'Recommend confirming aripiprazole LAI product, oral overlap requirement, last injection date, and monitoring for akathisia or activation.'},
  {name:'Olanzapine',class:'Atypical antipsychotic',category:'Antipsychotic',tags:['metabolic','sedation','weight','agitation'],pearls:['High metabolic risk; weight gain and sedation are common concerns.','Avoid combining IM olanzapine with parenteral benzodiazepines unless facility policy specifically permits and monitoring is in place.','Useful in agitation but cumulative sedation burden matters.'],monitoring:['A1c/glucose','lipids','weight/BMI','sedation','orthostasis','anticholinergic burden','duplicate CNS depressants'],redFlags:['excessive sedation','IM benzo overlap','rapid weight gain','orthostasis','fall risk'],note:'Recommend metabolic monitoring and assessment of sedation/orthostasis, especially when used with other CNS depressants or anticholinergic medications.'},
  {name:'Quetiapine',class:'Atypical antipsychotic',category:'Antipsychotic',tags:['sedation','orthostasis','metabolic','QT'],pearls:['Sedation and orthostasis are frequent limiting effects.','Low-dose use for sleep should be reviewed for risk/benefit.','Consider fall risk and additive CNS depression.'],monitoring:['sedation','orthostasis','falls','A1c/glucose','lipids','weight/BMI','QT risk'],redFlags:['falls','excessive sedation','orthostasis','low-dose sleep-only use','QT burden'],note:'Recommend assessing sedation, orthostasis, fall risk, metabolic monitoring, and whether low-dose use for sleep remains clinically justified.'},
  {name:'Sertraline',class:'SSRI antidepressant',category:'Antidepressant',tags:['SSRI','serotonin','GI','bleeding'],pearls:['Common SSRI option for depression, anxiety, PTSD, and related disorders.','Watch for GI upset, activation, sexual dysfunction, hyponatremia risk, and bleeding risk with NSAIDs/anticoagulants.','Assess for serotonin syndrome risk when combined with serotonergic agents.'],monitoring:['mood/suicidality early','GI effects','activation/insomnia','sodium risk','bleeding risk','serotonergic combinations'],redFlags:['serotonin syndrome symptoms','mania activation','bleeding risk','hyponatremia risk'],note:'Recommend monitoring for activation, GI effects, bleeding risk, hyponatremia risk, and serotonergic drug combinations.'},
  {name:'Venlafaxine / Desvenlafaxine',class:'SNRI antidepressant',category:'Antidepressant',tags:['SNRI','BP','withdrawal','serotonin'],pearls:['Blood pressure effects can be dose-related.','Discontinuation symptoms may be significant if abruptly stopped.','Review serotonergic combinations and activation/mania risk.'],monitoring:['blood pressure','withdrawal symptoms','activation/mania','serotonergic combinations','renal function for desvenlafaxine'],redFlags:['uncontrolled BP','abrupt stop','mania','serotonin syndrome symptoms'],note:'Recommend monitoring blood pressure, discontinuation risk, activation/mania symptoms, and serotonergic drug combinations with SNRI therapy.'},
  {name:'Trazodone',class:'Serotonergic antidepressant / hypnotic use',category:'Sleep/Anxiety',tags:['sedation','orthostasis','priapism','QT'],pearls:['Often used for sleep in behavioral health settings.','Additive sedation and orthostasis matter, especially with antipsychotics, benzodiazepines, and antihypertensives.','Rare priapism counseling may be clinically relevant.'],monitoring:['sedation','orthostasis','falls','QT risk','serotonergic combinations','priapism warning'],redFlags:['falls','syncope','QT burden','priapism','excessive sedation'],note:'Recommend reviewing sedation, orthostasis, fall risk, QT burden, and serotonergic overlap when trazodone is used for sleep.'},
  {name:'Hydroxyzine',class:'Antihistamine anxiolytic',category:'Sleep/Anxiety',tags:['sedation','anticholinergic','QT','PRN'],pearls:['Common non-benzodiazepine PRN for anxiety/insomnia.','Watch additive sedation and anticholinergic burden.','QT risk can matter when combined with other QT-prolonging medications.'],monitoring:['sedation','anticholinergic burden','QT risk','falls','PRN frequency'],redFlags:['excessive PRN use','falls','QT burden','urinary retention/confusion'],note:'Recommend reviewing hydroxyzine PRN frequency, sedation, anticholinergic burden, fall risk, and cumulative QT risk.'},
  {name:'Lorazepam',class:'Benzodiazepine',category:'Detox/PRN',tags:['sedation','falls','withdrawal','respiratory depression'],pearls:['Commonly used for acute agitation, catatonia, anxiety, and alcohol withdrawal protocols.','Additive sedation with antipsychotics, opioids, gabapentinoids, and other CNS depressants is important.','Monitor PRN frequency and taper/withdrawal concerns.'],monitoring:['sedation','respiratory status','falls','PRN frequency','withdrawal protocol','CNS depressant burden'],redFlags:['respiratory depression','falls','delirium','opioid combination','escalating PRN use'],note:'Recommend assessing lorazepam indication, PRN frequency, sedation/respiratory risk, fall risk, and cumulative CNS depressant burden.'},
  {name:'Buprenorphine / Naloxone',class:'Medication for opioid use disorder',category:'Substance Use',tags:['OUD','withdrawal','respiratory depression','diversion'],pearls:['Verify indication, dose, last use, withdrawal status, and continuation plan.','Watch additive CNS/respiratory depression with benzodiazepines, alcohol, and other sedatives.','Ensure discharge continuity and access planning when possible.'],monitoring:['withdrawal symptoms','sedation/respiratory status','adherence','diversion precautions per policy','drug interactions','discharge supply/access'],redFlags:['excess sedation','benzo/alcohol overlap','precipitated withdrawal concern','unclear home dose'],note:'Recommend verifying buprenorphine dose and withdrawal status, monitoring sedation/respiratory risk, and planning for continuity at discharge.'},
  {name:'Naltrexone',class:'Medication for alcohol/opioid use disorder',category:'Substance Use',tags:['AUD','OUD','LFT','opioid-free'],pearls:['Confirm opioid-free status before use for OUD to avoid precipitated withdrawal.','Review hepatic status and LFT monitoring per protocol.','For AUD, assess adherence and whether LAI formulation is appropriate.'],monitoring:['opioid-free status','LFTs','pain/opioid needs','adherence','AUD/OUD indication'],redFlags:['recent opioid use','acute hepatitis concern','need for opioid analgesia','precipitated withdrawal risk'],note:'Recommend confirming opioid-free status and indication before naltrexone, reviewing LFTs/hepatic status, and considering pain-management implications.'}
];
const categories = ['All','Antipsychotic','Mood Stabilizer','LAI','Antidepressant','Sleep/Anxiety','Detox/PRN','Substance Use'];

const checklists = [
  {title:'Daily Behavioral Health Pharmacy Review',icon:ClipboardCheck,items:['Any new starts, dose increases, or high-risk PRNs?','Duplicate antipsychotics or overlapping scheduled + PRN therapy?','QT risk: multiple QT drugs, low K/Mg, cardiac history, high-dose antipsychotic?','Metabolic monitoring needed: weight/BMI, glucose/A1c, lipids?','EPS/akathisia monitoring needed?','Sedation, fall risk, orthostasis, anticholinergic burden?','Renal/hepatic dose issues?','Clozapine, lithium, valproate, carbamazepine, LAI, or detox protocol concerns?','Controlled substance duplication, withdrawal risk, or taper issue?','Clear pharmacist recommendation documented?']},
  {title:'Clozapine Safety Checklist',icon:ShieldAlert,items:['ANC eligibility verified per current facility/REMS process','Baseline/current CBC with ANC reviewed','Bowel regimen or constipation monitoring addressed','Smoking status reviewed','Sedation/orthostasis risk reviewed','Metabolic labs reviewed or recommended','Early myocarditis warning signs monitored: fever, chest pain, tachycardia, dyspnea','Seizure risk and interacting medications assessed']},
  {title:'Mood Stabilizer Monitoring',icon:FlaskConical,items:['Lithium: level, SCr/eGFR, TSH, calcium, hydration/interactions','Valproate: level, LFTs, CBC/platelets, sedation/tremor/weight','Carbamazepine: CBC, LFTs, sodium, interactions, rash risk','Lamotrigine: titration schedule, rash/SJS counseling, missed-dose restart rules','Pregnancy-related risk considered when clinically relevant']},
  {title:'Agitation/PRN Review',icon:Brain,items:['PRN frequency suggests need to reassess scheduled therapy?','Multiple PRNs with same purpose?','IM antipsychotic + benzodiazepine safety per facility protocol?','Sedation/respiratory depression/fall risk reviewed?','EPS prophylaxis or treatment needed?','QT and electrolyte risk reviewed?']}
];
const templates = [
  ['QT Risk Recommendation','Recommend evaluating QT risk due to current psychotropic regimen and patient-specific risk factors. Consider EKG and correction of potassium/magnesium if clinically appropriate.'],
  ['Metabolic Monitoring Recommendation','Recommend metabolic monitoring for antipsychotic therapy, including weight/BMI, blood pressure, glucose or A1c, and lipid panel per facility protocol.'],
  ['EPS Monitoring Recommendation','Recommend monitoring for extrapyramidal symptoms, akathisia, dystonia, and parkinsonism, especially given antipsychotic dose burden and/or recent medication changes.'],
  ['Sedation/Fall Risk Recommendation','Recommend reviewing cumulative CNS depressant burden and monitoring for sedation, orthostasis, and fall risk. Consider dose timing or regimen simplification if clinically appropriate.'],
  ['Lithium Safety Recommendation','Recommend lithium level with renal and thyroid monitoring, review of interacting medications, hydration status assessment, and monitoring for tremor, GI symptoms, confusion, or ataxia.'],
  ['Clozapine Safety Recommendation','Recommend verifying ANC eligibility and clozapine monitoring requirements, assessing bowel function, reviewing smoking status, and monitoring for sedation, orthostasis, metabolic effects, myocarditis warning signs, and seizure risk.']
].map(([title,body])=>({title,body}));
const redFlagIssues = [
  ['QT Stacking Risk','High',['Multiple QT-prolonging meds','Low K/Mg','High-dose antipsychotic','Cardiac history'],'Consider EKG review, electrolyte correction, dose burden review, and alternative agents when clinically appropriate.'],
  ['Clozapine Constipation / Ileus Risk','High',['Clozapine','No bowel regimen','Anticholinergic burden','Abdominal pain or no BM'],'Recommend bowel function assessment, proactive bowel regimen per protocol, and urgent review for severe constipation or ileus symptoms.'],
  ['Lithium Toxicity Risk','High',['AKI/dehydration','NSAID','ACE/ARB','Diuretic','GI illness','Ataxia/confusion'],'Recommend lithium level, renal function review, interaction review, hydration assessment, and toxicity symptom assessment.'],
  ['Benzo + Opioid / CNS Depressant Burden','High',['Benzodiazepine','Opioid/buprenorphine','Gabapentin/pregabalin','Alcohol withdrawal meds','Excess sedation'],'Recommend monitoring sedation, respiratory status, fall risk, and cumulative CNS depressant burden.'],
  ['Antipsychotic Polypharmacy / PRN Escalation','Moderate-High',['Multiple scheduled antipsychotics','Frequent PRNs','EPS','QT risk','sedation'],'Recommend reviewing indication, PRN frequency, cumulative dose burden, EPS/QT risk, and simplification opportunities.'],
  ['LAI Timing / Missed-Dose Risk','Moderate-High',['Unknown last injection','Wrong product','Missed dose','Oral overlap unclear','Renal issue with paliperidone'],'Recommend verifying product, last dose date, dose, site, oral overlap requirements, and missed-dose protocol before administration.']
].map(([title,severity,triggers,action])=>({title,severity,triggers,action}));

const roundingQuestions = [
  ['antipsychotic','Antipsychotic started, increased, duplicated, or used frequently PRN?'],
  ['qt','QT risk present: multiple QT meds, low K/Mg, cardiac history, or high-dose antipsychotic?'],
  ['sedation','Sedation/fall/orthostasis risk from CNS depressant burden?'],
  ['metabolic','Metabolic monitoring needed for antipsychotic therapy?'],
  ['eps','EPS, akathisia, dystonia, tremor, or parkinsonism concern?'],
  ['labs','High-risk labs/levels due: clozapine ANC, lithium, valproate, CBC, LFT, renal, sodium?'],
  ['substance','Detox, withdrawal, buprenorphine, naltrexone, or controlled substance issue?'],
  ['discharge','Discharge continuity issue: LAI due, med access, taper, or follow-up monitoring?']
].map(([key,label])=>({key,label}));

const roundingRecommendations = {
  antipsychotic:'Review antipsychotic indication, cumulative dose burden, duplicate therapy, PRN frequency, EPS risk, and QT/metabolic monitoring.',
  qt:'Consider EKG review, potassium/magnesium correction, reduction of QT-stacking when possible, and monitoring per facility policy.',
  sedation:'Review cumulative CNS depressant burden and monitor sedation, orthostasis, respiratory status, and fall risk.',
  metabolic:'Recommend weight/BMI, blood pressure, glucose or A1c, and lipid monitoring per antipsychotic monitoring protocol.',
  eps:'Assess EPS/akathisia symptoms, recent antipsychotic changes, dose burden, and need for treatment or regimen adjustment.',
  labs:'Verify required labs/levels and timing for high-risk agents before continuation or dose adjustment.',
  substance:'Review withdrawal protocol, PRN frequency, respiratory/CNS depressant burden, continuation plan, and discharge access.',
  discharge:'Confirm medication access, LAI timing, monitoring follow-up, taper plans, and patient-specific counseling needs.'
};
function Button({children,onClick,active}){return <button onClick={onClick} className={active?'btn active':'btn'}>{children}</button>}
function Badge({children}){return <span className="badge">{children}</span>}
function SectionHeader({icon:Icon,title,subtitle}){return <div className="section"><div className="icon"><Icon size={20}/></div><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div></div>}
function MedCard({med,favorites,toggleFavorite}){return <div className="card"><div className="cardtop"><div><h3>{med.name}</h3><p>{med.class}</p></div><button className="star" onClick={()=>toggleFavorite(med.name)}>{favorites.includes(med.name)?<Star size={20} fill="currentColor"/>:<StarOff size={20}/>}</button></div><div className="badges">{med.tags.map(t=><Badge key={t}>{t}</Badge>)}</div><h4>Clinical pearls</h4><ul>{med.pearls.map((p,i)=><li key={i}>{p}</li>)}</ul><h4>Monitoring</h4><div className="badges">{med.monitoring.map(t=><Badge key={t}>{t}</Badge>)}</div><h4 className="redtitle">Red flags</h4><div className="badges">{med.redFlags.map(t=><span key={t} className="redbadge">{t}</span>)}</div><div className="note">{med.note}</div></div>}
function Tools({copyText,copied}){
  const [rounding,setRounding]=useState({});
  const [qt,setQt]=useState({qtMeds:0,lowElectrolytes:false,cardiac:false,highDose:false,older:false,other:false});

  const activeKeys=Object.keys(rounding).filter(k=>rounding[k]);
  const qtScore=Number(qt.qtMeds||0)+(qt.lowElectrolytes?2:0)+(qt.cardiac?1:0)+(qt.highDose?1:0)+(qt.older?1:0)+(qt.other?1:0);
  const qtLevel=qtScore>=5?'High':qtScore>=3?'Moderate':qtScore>=1?'Low':'Minimal';
  const qtAdvice=qtScore>=5?'High QT concern: consider EKG review, electrolyte correction, reducing QT-stacking, and provider clarification.':qtScore>=3?'Moderate QT concern: consider EKG/electrolyte review and monitor cumulative QT burden.':qtScore>=1?'Low QT concern: monitor and reassess if additional risk factors appear.':'No major QT risk factors selected.';
  const roundingSummary=activeKeys.length?activeKeys.map(k=>`• ${roundingRecommendations[k]}`).join('\n'):'No rounding issues selected yet.';

  return <div>
    <SectionHeader icon={Activity} title="Clinical Tools" subtitle="Red flags, rounding mode, and QT quick screen" />

    <div className="card">
      <h3 className="row"><AlertTriangle size={20}/> Red Flag Mode</h3>
      {redFlagIssues.map(issue=><div className="note" key={issue.title}>
        <h4>{issue.title} <span className="redbadge">{issue.severity}</span></h4>
        <div className="badges">{issue.triggers.map(t=><span key={t} className="redbadge">{t}</span>)}</div>
        <p>{issue.action}</p>
      </div>)}
    </div>

    <div className="card">
      <h3 className="row"><Stethoscope size={20}/> Daily Rounding Mode</h3>
      {roundingQuestions.map(q=><label className="check" key={q.key}><input type="checkbox" checked={!!rounding[q.key]} onChange={e=>setRounding({...rounding,[q.key]:e.target.checked})}/> {q.label}</label>)}
      <div className="note" style={{whiteSpace:'pre-line'}}>{roundingSummary}</div>
      <button className="small" onClick={()=>copyText('Rounding Summary',roundingSummary)}>Copy Summary</button>
      {copied==='Rounding Summary'&&<p className="copied">Copied.</p>}
    </div>

    <div className="card">
      <h3 className="row"><HeartPulse size={20}/> QT Risk Quick Tool</h3>
      <label className="check">QT-prolonging meds: <input type="number" min="0" value={qt.qtMeds} onChange={e=>setQt({...qt,qtMeds:e.target.value})}/></label>
      <label className="check"><input type="checkbox" checked={qt.lowElectrolytes} onChange={e=>setQt({...qt,lowElectrolytes:e.target.checked})}/> Low K/Mg or electrolyte concern</label>
      <label className="check"><input type="checkbox" checked={qt.cardiac} onChange={e=>setQt({...qt,cardiac:e.target.checked})}/> Cardiac history or baseline QT concern</label>
      <label className="check"><input type="checkbox" checked={qt.highDose} onChange={e=>setQt({...qt,highDose:e.target.checked})}/> High-dose antipsychotic or rapid escalation</label>
      <label className="check"><input type="checkbox" checked={qt.older} onChange={e=>setQt({...qt,older:e.target.checked})}/> Older/frail/fall-risk patient</label>
      <label className="check"><input type="checkbox" checked={qt.other} onChange={e=>setQt({...qt,other:e.target.checked})}/> Other risk factor present</label>
      <div className="blue"><b>QT Score:</b> {qtScore} — <b>{qtLevel}</b><br/>{qtAdvice}</div>
      <button className="small" onClick={()=>copyText('QT Summary',`QT risk quick screen: score ${qtScore} (${qtLevel}). ${qtAdvice}`)}>Copy QT Note</button>
      {copied==='QT Summary'&&<p className="copied">Copied.</p>}
    </div>
  </div>
}
function Calcs(){
  const [wt,setWt]=useState('');
  const [age,setAge]=useState('');
  const [scr,setScr]=useState('');
  const [sex,setSex]=useState('male');
  const [height,setHeight]=useState('');
  const [alb,setAlb]=useState('');
  const [ca,setCa]=useState('');
  const [wbc,setWbc]=useState('');
  const [neut,setNeut]=useState('');

  const crcl = wt && age && scr
    ? Math.max(0, (((140-Number(age))*Number(wt))/(72*Number(scr))) * (sex==='female'?0.85:1)).toFixed(1)
    : '';

  const bmi = wt && height
    ? ((Number(wt)/Math.pow(Number(height),2))*703).toFixed(1)
    : '';

  const correctedCa = ca && alb
    ? (Number(ca) + 0.8*(4-Number(alb))).toFixed(1)
    : '';

  const anc = wbc && neut
    ? ((Number(wbc)*1000)*(Number(neut)/100)).toFixed(0)
    : '';

  return <div>
    <SectionHeader icon={Calculator} title="Dosing & Monitoring Calcs" subtitle="Quick screens only — verify with facility policy and current references" />

    <div className="card">
      <h3>Creatinine Clearance</h3>
      <p className="bodytext">Cockcroft-Gault estimate. Use actual, adjusted, or ideal body weight based on your facility protocol.</p>

      <label className="check">Age: <input type="number" value={age} onChange={e=>setAge(e.target.value)} /></label>
      <label className="check">Weight in kg: <input type="number" value={wt} onChange={e=>setWt(e.target.value)} /></label>
      <label className="check">SCr: <input type="number" value={scr} onChange={e=>setScr(e.target.value)} /></label>

      <label className="check">Sex:
        <select value={sex} onChange={e=>setSex(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>

      <div className="blue"><b>Estimated CrCl:</b> {crcl ? `${crcl} mL/min` : 'Enter values'}</div>
    </div>

    <div className="card">
      <h3>BMI</h3>
      <label className="check">Weight in lb: <input type="number" value={wt} onChange={e=>setWt(e.target.value)} /></label>
      <label className="check">Height in inches: <input type="number" value={height} onChange={e=>setHeight(e.target.value)} /></label>
      <div className="blue"><b>BMI:</b> {bmi || 'Enter values'}</div>
    </div>

    <div className="card">
      <h3>Corrected Calcium</h3>
      <label className="check">Measured calcium: <input type="number" value={ca} onChange={e=>setCa(e.target.value)} /></label>
      <label className="check">Albumin: <input type="number" value={alb} onChange={e=>setAlb(e.target.value)} /></label>
      <div className="blue"><b>Corrected Ca:</b> {correctedCa ? `${correctedCa} mg/dL` : 'Enter values'}</div>
    </div>

    <div className="card">
      <h3>ANC Calculator</h3>
      <p className="bodytext">Useful for clozapine monitoring. Enter WBC as K/uL and neutrophils as percent.</p>
      <label className="check">WBC: <input type="number" value={wbc} onChange={e=>setWbc(e.target.value)} /></label>
      <label className="check">Neutrophils %: <input type="number" value={neut} onChange={e=>setNeut(e.target.value)} /></label>
      <div className="blue"><b>ANC:</b> {anc ? `${anc} cells/uL` : 'Enter values'}</div>
    </div>

    <div className="card">
      <h3>Monitoring Reminders</h3>
      <div className="note">
        <b>Clozapine:</b> ANC, bowel function, metabolic labs, myocarditis symptoms early in therapy.<br/><br/>
        <b>Lithium:</b> level, renal function, TSH, calcium, interacting meds, hydration status.<br/><br/>
        <b>Valproate:</b> level, LFTs, CBC/platelets, sedation, tremor, pregnancy-related risk when relevant.<br/><br/>
        <b>Antipsychotics:</b> weight/BMI, A1c/glucose, lipids, EPS, QT risk, sedation/orthostasis.
      </div>
    </div>
  </div>
}function App(){
 const [tab,setTab]=useState('meds'),[query,setQuery]=useState(''),[category,setCategory]=useState('All'),[favorites,setFavorites]=useState([]),[copied,setCopied]=useState('');
 const filtered=useMemo(()=>{const q=query.toLowerCase();return meds.filter(m=>(category==='All'||m.category===category)&&[m.name,m.class,m.category,...m.tags,...m.pearls,...m.monitoring,...m.redFlags].join(' ').toLowerCase().includes(q))},[query,category]);
 const toggleFavorite=name=>setFavorites(prev=>prev.includes(name)?prev.filter(x=>x!==name):[...prev,name]);
 const copyText=async(t,b)=>{try{await navigator.clipboard.writeText(b);setCopied(t);setTimeout(()=>setCopied(''),1800)}catch{setCopied('Copy unavailable')}};
 return <div className="app"><main><header><div className="brand"><Pill/><h1>BH Pharm</h1></div><span>Pocket Guide</span><p>Privacy-safe behavioral health pharmacy workflow support. Avoid entering patient names, DOBs, MRNs, or other PHI.</p></header><nav>
  <Button active={tab==='meds'} onClick={()=>setTab('meds')}>Meds</Button>
  <Button active={tab==='lai'} onClick={()=>setTab('lai')}>LAIs</Button>
  <Button active={tab==='tools'} onClick={()=>setTab('tools')}>Tools</Button>
  <Button active={tab==='calcs'} onClick={()=>setTab('calcs')}>Calcs</Button>
  <Button active={tab==='checks'} onClick={()=>setTab('checks')}>Checks</Button>
  <Button active={tab==='notes'} onClick={()=>setTab('notes')}>Notes</Button>
</nav>{tab==='meds'&&<><SectionHeader icon={Search} title="Psych Med Search" subtitle="Fast pearls, monitoring, and note language"/><div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search clozapine, QT, ANC, EPS..."/></div><div className="chips">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?'chip chipactive':'chip'}>{c}</button>)}</div><div>{filtered.map(m=><MedCard key={m.name} med={m} favorites={favorites} toggleFavorite={toggleFavorite}/>)}</div></>}{tab==='lai'&&<><SectionHeader icon={Pill} title="LAI Quick Check" subtitle="Verify product, timing, overlap, and missed-dose rules"/>{meds.filter(m=>m.category==='LAI').map(m=><div className="card" key={m.name}><h3>{m.name}</h3><p>{m.class}</p><div className="blue"><b>Before administration:</b> confirm exact product, last injection date, dose, site, initiation status, oral overlap need, renal considerations when relevant, and missed-dose instructions.</div>{m.monitoring.map((it,i)=><label className="check" key={i}><input type="checkbox"/> {it}</label>)}<h4 className="redtitle">Red flags</h4><div className="badges">{m.redFlags.map(t=><span key={t} className="redbadge">{t}</span>)}</div></div>)}</>}{tab==='tools'&&<Tools copyText={copyText} copied={copied}/>}{tab==='calcs'&&<Calcs/>}{tab==='checks'&&<><SectionHeader icon={ClipboardCheck} title="Checklists" subtitle="Use as a thinking aid, not a substitute for clinical judgment"/>{checklists.map(list=>{const Icon=list.icon;return <div className="card" key={list.title}><h3 className="row"><Icon size={20}/>{list.title}</h3>{list.items.map((item,i)=><label className="check" key={i}><input type="checkbox"/> {item}</label>)}</div>})}</>}{tab==='notes'&&<><SectionHeader icon={FileText} title="Consult Note Templates" subtitle="Tap copy, then customize before documenting"/>{templates.map(t=><div className="card" key={t.title}><div className="cardtop"><h3>{t.title}</h3><button className="small" onClick={()=>copyText(t.title,t.body)}>Copy</button></div><p className="bodytext">{t.body}</p>{copied===t.title&&<p className="copied">Copied.</p>}</div>)}</>}<footer><HeartPulse/><p><b>Safety note:</b> This prototype is for pharmacist workflow support only. Do not enter PHI. Verify recommendations against facility policy, current labeling, and clinical judgment.</p></footer></main></div>
}
createRoot(document.getElementById('root')).render(<App/>);
