require('dotenv').config()

const {
	Bot,
	Keyboard,
	InlineKeyboard,
	GrammyError,
	HttpError
} = require('grammy')

// Импорт функций для работы с вопросами и ответами
const {
	getRandomTest,
	getCorrectAnswer
} = require('./src/components/utils/utils')

const bot = new Bot(process.env.BOT_API_KEY)

// Обработка команды /start
bot.command('start', async ctx => {
	// Создание клавиатуры с выбором действия
	const startKeyboard = new Keyboard().text('Start').resized()

	// Отправка приветственного сообщения и клавиатуры
	await ctx.reply(
		"Привет! Я Бот, Бот для изучения английского🤖 \nЯ помогу тебе расширить свой словарный запас через тесты🥷"
	)
	await ctx.reply(
		"Начнем учиться... на данный момент у меня есть 400 слов для повторения.\nНажмите на кнопку👇",
		{
			reply_markup: startKeyboard
		}
	)
})

bot.hears('Start', async ctx => {
	const topic = ctx.message.text.toLocaleLowerCase()

	const question = getRandomTest(topic)

	const fullQuestion = `🥷\nHow is it translated: <b><u>❗${question.question.toUpperCase()}❗</u></b> <b>${question.text.toLocaleLowerCase()}</b> 👀`

	let inlineKeyboard

	const buttonRows = question.options.map(option => {
		return [
			InlineKeyboard.text(
				option.answer.toUpperCase(),
				JSON.stringify({
					type: topic,
					isCorrect: option.isCorrect,
					questionId: option.id
				})
			)
		]
	})

	inlineKeyboard = InlineKeyboard.from(buttonRows)

	await ctx.reply(fullQuestion, {
		reply_markup: inlineKeyboard,
		parse_mode: 'HTML'
	})
})

bot.on('callback_query:data', async ctx => {
	const callbackData = JSON.parse(ctx.callbackQuery.data)

	// Получаем информацию о текущем вопросе и теме
	const currentTopic = callbackData.type.split(' - ')[0]
	const currentQuestionId = callbackData.questionId

	if (callbackData.isCorrect) {
		// Выбираем следующий вопрос из той же темы
		const nextQuestion = getRandomTest(currentTopic)

		const fullQuestion = `🥷\nHow is it translated: <b><u>❗${nextQuestion.question.toUpperCase()}❗</u></b> <b>${nextQuestion.text.toLocaleLowerCase()}</b> 👀`

		await ctx.reply('✅ Right ✅')

		let inlineKeyboard

		const buttonRows = nextQuestion.options.map(option => {
			return [
				InlineKeyboard.text(
					option.answer.toUpperCase(),
					JSON.stringify({
						type: `${currentTopic} - option`,
						isCorrect: option.isCorrect,
						questionId: nextQuestion.id
					})
				)
			]
		})

		inlineKeyboard = InlineKeyboard.from(buttonRows)

		await ctx.reply('---👇New question👇---')
		// Отправляем следующий вопрос
		await ctx.reply(fullQuestion, {
			reply_markup: inlineKeyboard,
			parse_mode: 'HTML'
		})

		await ctx.answerCallbackQuery()
		return
	}

	const answer = getCorrectAnswer(currentTopic, currentQuestionId)
	await ctx.reply(
		`❌*Wrong*❌ \n \n*Correct answer:➡️${answer.toUpperCase()}* 👀`,
		{ parse_mode: 'Markdown' }
	)
	await ctx.answerCallbackQuery()
})

// Обработка ошибок
bot.catch(err => {
	const ctx = err.ctx
	console.error(`Error while handling update ${ctx.update.update_id}:`)
	const e = err.error
	if (e instanceof GrammyError) {
		console.error('Error in request:', e.description)
	} else if (e instanceof HttpError) {
		console.error('Could not contact Telegram:', e)
	} else {
		console.error('Unknown error:', e)
	}
})

// Запуск бота
bot.start()
