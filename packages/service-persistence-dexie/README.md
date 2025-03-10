I am using repositories

```typescript
class DocumentRepository {
  constructor(
    private db: DxDatabase) {
  }

  save(doc: Document): void {
    throw new Error('Method not implemented.');
  }

  deleteDocument(id: string): void {
    throw new Error('Method not implemented.');
  }
}
```

Here is a service using the UnitOfWork

```typescript
class SomeService {
  repo: DocumentRepository
  uow: UnitOfWork
  async someUseCase() {
    uow.start()
    await uow.commit(
      this.repo.deleteDocument(),
      this.repo.save(),
    )
  }
}
```

The UnitOfWork should already have access to the database at the time of using it in the class
The uow must be started, and there cannot be already another one running

---

Issues with the implementation 

There can be multiple repositories, so the commit function must detect which repositories it needs to use
In addition, the operations are not async, but are wrapper functions that are executed async during commit

```typescript
class SomeService {
  docRepo: DocumentRepository
  userRepo: UserRepository
  uow: UnitOfWork
  async someUseCase() {
    uow.start()
    await uow.commit(
      this.userRepo.update(),
      this.docRepo.save(),
    )
  }
}
```