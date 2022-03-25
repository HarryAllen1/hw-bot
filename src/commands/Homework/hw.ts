import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';
import type { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { getClass, Subjects } from '../../lib/utils/firestore.js';

@ApplyOptions<CommandOptions>({
  name: 'hw',
  description: 'Shows homework for a grade',
})
export class UserCommand extends Command {
  public async chatInputRun(interaction: CommandInteraction) {
    if (interaction.options.getString('subject')) {
      const className = await getClass(
        interaction.options.getInteger('grade', true),
        <Subjects>interaction.options.getString('subject', true)
      );
      const assignments: { name: string; value: string }[] = [];
      className.forEach((res) => {
        if (parseInt(res.id) > Date.now()) assignments.push(<any>res.data());
      });
      console.log(assignments);
      interaction.reply({
        embeds: [
          {
            title: `Homework for ${interaction.options.getInteger(
              'grade',
              true
            )}th ${interaction.options.getString('subject', true)}`,
            fields: !assignments[0]
              ? [
                  {
                    name: 'No homework for this class',
                    value: ':)',
                    inline: false,
                  },
                ]
              : assignments,
          },
        ],
      });
    }
  }
  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addIntegerOption((i) =>
            i
              .setName('grade')
              .setDescription('The grades assignments to get.')
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addStringOption((i) =>
            i
              .setName('subject')
              .setDescription('The subject of the assignment.')
              .setRequired(false)
              .setAutocomplete(true)
          )
          .addStringOption((i) =>
            i
              .setName('due-date')
              .setDescription('The due date of the assignment.')
              .setRequired(false)
              .setAutocomplete(false)
          )
          .addStringOption((i) =>
            i
              .setName('assigned-date')
              .setDescription('The assigned date of the assignment.')
              .setRequired(false)
              .setAutocomplete(false)
          ),
      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ['956773036101599236', '956774184510439494'],
      }
    );
  }
  public async autocompleteRun(interaction: AutocompleteInteraction) {
    interaction.respond(
      interaction.options.getFocused(true).name === 'grade'
        ? [
            { name: '9th grade', value: 9 },
            { name: '10th grade', value: 10 },
            { name: '11th grade', value: 11 },
            { name: '12th grade', value: 12 },
          ]
        : [
            { name: 'English', value: 'english' },
            { name: 'Math', value: 'math' },
            { name: 'Science', value: 'science' },
            { name: 'History', value: 'history' },
          ]
    );
  }
}