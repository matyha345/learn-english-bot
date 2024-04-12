const questions = require('../data/word_groups_shuffled.json')

const { Random } = require('random-js')

let questionIndex = 0

const getNextQuestionIndex = topic => {
	if (!questions[topic] || questions[topic].length === 0) {
		return -1
	}

	questionIndex = (questionIndex + 1) % questions[topic].length
	return questionIndex
}

const getNextQuestion = topic => {
	const nextIndex = getNextQuestionIndex(topic)
	return questions[topic][nextIndex]
}

const getRandomTest = topic => {
	const random = new Random()

	const questionTopic = topic

	if (topic === 'newwords') {
		return getNextQuestion(questionTopic)
	} else {
		const randomQuestionIndex = random.integer(
			0,
			questions[questionTopic].length - 1
		)
		return questions[questionTopic][randomQuestionIndex]
	}
}

const getCorrectAnswer = (topic, id) => {
	const topicQuestions = questions[topic]
	if (!topicQuestions) {
		return 'Incorrect, try again.'
	}
	const question = topicQuestions.find(question => question.id === id)
	return question.options.find(option => option.isCorrect).answer
}

module.exports = { getRandomTest, getCorrectAnswer, getNextQuestion }
