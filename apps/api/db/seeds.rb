# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


# db/seeds.rb
puts "Limpiando datos…"

ProjectMembership.delete_all
Project.delete_all
User.delete_all

puts "Creando usuarios…"

users_data = [
  { name: "Anthony", last_name: "Shinomiya", email: "anthony@example.com" },
  { name: "Claudia", last_name: "Mendoza", email: "claudia@example.com" },
  { name: "Marcos", last_name: "Rojas", email: "marcos@example.com" },
  { name: "Fernanda", last_name: "Pérez", email: "fernanda@example.com" },
  { name: "Luis", last_name: "Gutiérrez", email: "luis@example.com" },
  { name: "Sofía", last_name: "Lagos", email: "sofia@example.com" }
]

users = users_data.map do |attrs|
  User.create!(
    email: attrs[:email],
    password: "12345678",
    password_confirmation: "12345678",
    name: attrs[:name],
    last_name: attrs[:last_name]
  )
end

puts "Usuarios creados: #{users.count}"

stages = %i[idea fundraising in_progress completed] # ajusta según tu enum

projects_specs = [
  {
    title: "Bosques Urbanos",
    description: "Reforestación de espacios públicos con participación comunitaria.",
    tags: %w[medioambiente comunidad árboles]
  },
  {
    title: "Mentorías STEM",
    description: "Programa de mentorías para jóvenes interesados en ciencia y tecnología.",
    tags: %w[educación tecnología juventud]
  },
  {
    title: "Red de Huertas Urbanas",
    description: "Huertas colaborativas en distintos barrios para fomentar agricultura local.",
    tags: %w[alimentación sustentable comunidad]
  },
  {
    title: "Festival de Arte Comunitario",
    description: "Intervenciones artísticas en barrios con baja oferta cultural.",
    tags: %w[arte cultura comunidad]
  },
  {
    title: "Talleres de Finanzas Personales",
    description: "Capacitaciones gratuitas de educación financiera.",
    tags: %w[educación finanzas inclusión]
  },
  {
    title: "Reciclaje en tu Barrio",
    description: "Sistema colaborativo de puntos limpios en sectores residenciales.",
    tags: %w[reciclaje eco medioambiente]
  }
]

puts "Creando proyectos + memberships…"

projects = []

projects_specs.each_with_index do |spec, idx|
  owner = users[idx % users.size]
  stage = stages[idx % stages.size]

  project = owner.owned_projects.create!(
    title: spec[:title],
    description: spec[:description],
    stage: stage,
    tags: spec[:tags]
  )

  # membership de owner
  ProjectMembership.create!(
    user: owner,
    project: project,
    role: :owner
  )

  # algunos colaboradores
  collaborators = users.sample(2).reject { |u| u == owner }
  collaborators.each do |user|
    ProjectMembership.create!(
      user: user,
      project: project,
      role: :collaborator
    )
  end

  # algunos followers extra
  followers = users.sample(3).reject { |u| u == owner || collaborators.include?(u) }
  followers.each do |user|
    ProjectMembership.create!(
      user: user,
      project: project,
      role: :follower
    )
  end

  projects << project
end

puts "Proyectos creados: #{projects.count}"
puts "Listo. Usuarios + proyectos + memberships sembrados."
