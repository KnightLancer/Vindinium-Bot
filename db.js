var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/vind')

var BotSchema = mongoose.Schema({
  name: {type: String, default: '', unique: true},
  code: {type: String, default: ''}
});

var Bot = mongoose.model('Bot', BotSchema);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

var bot = new Bot({name: 'test', code: "console.log('hi');"})

Bot.count({}, function(err, c) {
  console.log('Count:', c)
  if(c < 1) {
    bot.save(function(err, bot) {
      console.log('bot saved')
    })
  }
});

console.log(bot)