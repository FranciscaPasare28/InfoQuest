import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.sto';
import { AtAuthGuard } from "../auth/guard/at-auth.guard";
import { RequestUser } from "../auth/decorator/request-user.decorator";
import { User } from "../users/entities/user.entity";

@Controller('notes')
@UseGuards(AtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @RequestUser() user: User) {
    return this.notesService.create(createNoteDto, user);
  }

  @Get()
  findAll(@RequestUser() user: User) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @RequestUser() user: User) {
    return this.notesService.findOne(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @RequestUser() user: User) {
    return this.notesService.update(+id, updateNoteDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @RequestUser() user: User) {
    return this.notesService.remove(+id, user);
  }
}
