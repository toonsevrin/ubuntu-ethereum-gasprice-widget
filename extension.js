/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */
const {St, Clutter} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Lang = imports.lang;
const Soup = imports.gi.Soup;
let soupSyncSession = new Soup.SessionSync();
let panelButton;

const url = "https://ethgasstation.info/api/ethgasAPI.json";
const gasType = "safeLow";
const timeoutSec = 30; // timeout in seconds

class Extension {
    constructor() {
        panelButton = new St.Bin({
            style_class : "panel-button",
        });
        let panelButtonText = new St.Label({
            text : "Hello World",
            y_align: Clutter.ActorAlign.CENTER,
        });
        panelButton.set_child(panelButtonText);

        this.update();
    
    }
    update() {
        let message = Soup.Message.new('GET', url);
        let responseCode = soupSyncSession.send_message(message);
        let res;
        if(responseCode == 200) {
            res = JSON.parse(message['response-body'].data);
            if (typeof(res[gasType]) == "number") {
                panelButton.get_child().text = res[gasType]/10 + " Gwei";
            }
        }
        Mainloop.timeout_add_seconds(timeoutSec, Lang.bind(this, function() {
            this.update();
        }));
    }
    enable() {
        Main.panel._rightBox.insert_child_at_index(panelButton, 0);
    }

    disable() {
        Main.panel._rightBox.remove_child(panelButton);
    }
}

function init() {
    return new Extension();
}
