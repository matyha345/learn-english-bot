const questions = require('../data/word_groups_shuffled.json')

const { Random } = require('random-js')

const getRandomTest = (topic) => {
 const random = new Random()

 const questionTopic = topic

 const randomQuestionIndex = random.integer(
     0,
     questions[questionTopic].length - 1
 )
 return questions[questionTopic][randomQuestionIndex]
}

// Функция для получения корректного ответа на вопрос
const getCorrectAnswer = (topic, id) => {
	// Получение списка вопросов по заданной теме
	const topicQuestions = questions[topic]
	if (!topicQuestions) {
		// Если тема не найдена, возвращается сообщение об ошибке
		return 'Incorrect, try again.'
	}

	// Поиск вопроса по его идентификатору
	const question = topicQuestions.find(question => question.id === id)

	// Если у вопроса есть варианты ответа, возвращается текст корректного ответа
	return question.options.find(option => option.isCorrect).answer

	
}

module.exports = { getRandomTest, getCorrectAnswer }