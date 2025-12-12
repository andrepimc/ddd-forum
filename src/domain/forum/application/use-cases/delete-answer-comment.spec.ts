import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { makeAnswer } from "../../../../../test/factories/make-answer"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { DeleteCommentAnswerUseCase } from "./delete-comment-answer"
import { InMemoryAnswersCommentsRepository } from "../../../../../test/repositories/in-memory-answers-comment-repository"
import { makeAnswerComment } from "../../../../../test/factories/make-comment-answer"

let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteCommentAnswerUseCase

describe("delete a comment on an answer", () => {
  beforeEach(() => {
    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteCommentAnswerUseCase(inMemoryAnswersCommentsRepository)
  })
  it("should delete an answer comment", async () => {
    const newAnswer = makeAnswer()
    inMemoryAnswersRepository.create(newAnswer)

    const answerComment = makeAnswerComment({
      answerId: newAnswer.id,
      authorId: new UniqueEntityId("user-1"),
    })

    inMemoryAnswersCommentsRepository.create(answerComment)

    await sut.execute({
      authorId: "user-1",
      answerCommentId: answerComment.id.toString(),
    })

    expect(inMemoryAnswersCommentsRepository.items).toHaveLength(0)
  })
  it.skip("should not be able to delete an answer comment not owned", async () => {
    const newAnswer = makeAnswer()
    inMemoryAnswersRepository.create(newAnswer)

    const answerComment = makeAnswerComment({
      answerId: newAnswer.id,
      authorId: new UniqueEntityId("user-1"),
    })

    inMemoryAnswersCommentsRepository.create(answerComment)

    expect(async () => {
      return await sut.execute({
        authorId: "user-x",
        answerCommentId: answerComment.id.toString(),
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
