/**
 * Generate random usernames for anonymous users
 */

const adjectives = [
  'Anonymous', 'Musical', 'Melodic', 'Harmonic', 'Rhythmic', 'Creative', 
  'Artistic', 'Talented', 'Skilled', 'Passionate', 'Dedicated', 'Inspiring',
  'Graceful', 'Elegant', 'Expressive', 'Dynamic', 'Vibrant', 'Soulful'
]

const nouns = [
  'Pianist', 'Musician', 'Artist', 'Player', 'Performer', 'Composer',
  'Visitor', 'Explorer', 'Enthusiast', 'Lover', 'Fan', 'Student',
  'Traveler', 'Dreamer', 'Creator', 'Virtuoso', 'Maestro', 'Prodigy'
]

/**
 * Generate a random username for anonymous users
 */
export function generateRandomUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 999) + 1
  
  return `${adjective}${noun}${number}`
}

/**
 * Get display name for a user (logged in user's name or random username)
 */
export function getDisplayName(user: any): string {
  if (user?.full_name) {
    return user.full_name
  }
  if (user?.email) {
    return user.email.split('@')[0]
  }
  return generateRandomUsername()
}