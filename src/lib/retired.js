// Wording the site used to ship with. If the database still holds it word for word (because it was
// copied in by "Fill the database" and never edited), the newer built-in wording is shown instead.
const RETIRED = {
  intro: [
    'Member of Parliament for Nyeri Town and Vice-Chairperson of the National Cohesion and Equal Opportunity Committee, serving in the 13th Parliament with a record in health, coffee and tea, and public investments. Before Parliament he was a certified dental technologist and health systems manager.',
    'A certified dental technologist and health systems manager, now serving Nyeri Town in the National Assembly with a record in health, coffee and tea, national cohesion and public investments.',
  ],
}
export const dropRetired = (doc) => {
  if (!doc) return doc
  const out = { ...doc }
  for (const [k, olds] of Object.entries(RETIRED)) if (olds.includes(String(out[k] || '').trim())) delete out[k]
  return out
}

