Game.destroy_all
puts 'Games deleted'


Game.create(name: 'Tetris')
puts 'Tetris game created'

if User.count == 0
  User.create(id: 0, email: "anonymous@random.com", username: "Anonymous", password: 'thisisasafepassword')
  User.create(email: "blaisma@live.fr", username: "Morphizz", password: '123456')
end
