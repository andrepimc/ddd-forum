import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { makeQuestion } from "../../../../../test/factories/make-question"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { makeAnswer } from "../../../../../test/factories/make-answer"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe("Find many recent questions with pagination", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })
  it("should return question answers in order", async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityId("question-1"))

    inMemoryQuestionsRepository.create(newQuestion)

    const answer1ForQuestion = makeAnswer(
      {
        questionId: newQuestion.id,
        createdAt: new Date(2025, 12, 20),
      },
      new UniqueEntityId("answer-1")
    )

    const answer2ForQuestion = makeAnswer(
      {
        questionId: newQuestion.id,
        createdAt: new Date(2025, 12, 22),
      },
      new UniqueEntityId("answer-2")
    )

    inMemoryAnswersRepository.create(answer1ForQuestion)
    inMemoryAnswersRepository.create(answer2ForQuestion)

    const { answers } = await sut.execute({ questionId: "question-1", page: 1 })

    expect(answers).toEqual([
      expect.objectContaining({ createdAt: answer2ForQuestion.createdAt }),
      expect.objectContaining({ createdAt: answer1ForQuestion.createdAt }),
    ])
  })

  it("should return question answers with pagination", async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityId("question-1"))

    inMemoryQuestionsRepository.create(newQuestion)

    for (let i = 1; i <= 22; i++) {
      const newAnswer = makeAnswer({
        questionId: newQuestion.id,
      })

      inMemoryAnswersRepository.create(newAnswer)
    }

    const { answers } = await sut.execute({ questionId: "question-1", page: 2 })

    expect(answers).toHaveLength(2)
  })
})
