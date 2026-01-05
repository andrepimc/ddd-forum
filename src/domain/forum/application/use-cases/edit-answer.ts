import { Either, left, right } from "../../../../core/either"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { Answer } from "../../enterprise/entities/answer"
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list"
import { AnswerAttachmentsRepository } from "../repositories/answer-comments.repository"
import { AnswersRepository } from "../repositories/answers-repository"
import { NotAllowedError } from "./errors/not-allowed-error"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface EditAnswerUseCaseRequest {
  id: string
  authorId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>

export class EditAnswerUseCase {
  constructor(
    private AnswersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}
  async execute({
    id,
    authorId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.AnswersRepository.findById(id)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(id)

    const answerAttachmentsList = new AnswerAttachmentList(
      currentAnswerAttachments
    )

    const newAnswerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentsList.update(newAnswerAttachments)

    answer.content = content
    answer.attachments = answerAttachmentsList

    await this.AnswersRepository.save(answer)

    return right({ answer })
  }
}
