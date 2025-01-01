// @ts-nocheck
export const lock = "";
/**
 * These are intentionally disabled this framework is not for use in a real context it is for teaching the absolute basics.
 *
 * If you wish to use these features of js I'd really recommend you consider a different library.
 */

const meme_msg = `
:                                     :%
@                              -.  .#                                      @  *
%          .           +     @@@@@@@@@@                                    %  =
%                    # =    @@@@--##%@@+                                   %  -
#                      =    @@%*   -*%@@                                   @  :
#                      -    @@@*+++-=#@@@                                  @  -
#                      -     @@@@@@   *%@                                  @  *
#                      -     @@  @+%*-*+@                                  @  +
*   :     .-  : #=%% = =:    %@#        @              . =.      -         @  +
# :.+ +*%%:+ ++ #=+  + =+*     -        @@   :+-     + -  -+:=::+=:  :     @ .#
###**==*@%-*  +-#+%*.* =...   %@@      @@@@@@%##%*  :. -:#-+*--.#=--+=*+:==@::#
#@%-*   :*:+ +=:* +  *     #@@@@@@@@@@@@@@@@@%@%@%%%*#*: . -+%-:%*-  -@=---@--%
# =#*: :*+ +  :   +  @@@@@@@+@@@@@@@@@@@%%%@@%%@@@%%  %@%%@  .:-#= %:    :@ +%
# =--=%*   -  :   = @@GG EZ@@@@@@@@@@@@%%     -:+= : *%.@ -%
##%-       :  .   : @@@%%@@@@%@@%%%%%###%#%#####%:*%%%%%%%#%%.   ..   #=-+ @ %@
*          :  .     #@@%%% #@@@%###%%%-############%@%@%@%%#%#%          #+@ %@
+          .        @@@%%%# @@@@#%#%%  %%%%#####%%%%@@@@%%%#####*          @ %@
+        - -   =    @%@@@@. @@@@@@:       #%%###%%%@@@ :   #######+        @  @
-        - #        @@@@%#-+=-%%@@@@. =  %%%%%%%%%%%@@  .   ###*#%##       @  @
=      -   +        @@@@%%###*#%%%%##%@@=#%%%%%%@%%@@     -   %#@@%%%      @ .@
+.  =      :  :     @@@@@%%#####*-=%%#@@@@@%@@@@@@@@%       .. @@%%%%%   . @ -@
- -                  @@@@@%%%%%%%###%@+*####   @@@@@          =@@%%%%%%    @ =@
=:  :.   + +. -.-:=@@+.*%@@@@@@@@%:#@%+*#**### %##@.       . -@##+=%%% ..*:@ #@
*--:    -+ :  ..: @@ . .      :@@+@@#@#+++=-#=@##%=    . :--+@%##:++@    :+@ #@
%#######**-*+****+@#++++###%%%@@@#*@@@%+#%#%%%%%%%: :.--:+:+@%%#--##%#++*+%@-%@
####%#**+*-++++++=@################%@@%@@%.   %%%@@@@%---=:@%%**##%%***+**%@=@@
%%%%%***###*##+**+@#################@@@@@@-#@@@@@@@@@@===#@%#++#%#%%###%%%%@#@@`;

const msg = `This feature has been intentionally disabled for this library, this library is focused on learning the absolute basics of programming so some features are intentionally disabled to force you to do stuff the simple way :).`;

/**
 * @private
 */
Array.prototype._reduce = Array.prototype.reduce;
Array.prototype.reduce = function () {
    console.warn(msg);
};

/**
 * @private
 */
Array.prototype._filter = Array.prototype.filter;
Array.prototype.filter = function () {
    console.warn(msg);
};

/**
 * @private
 */
Array.prototype._map = Array.prototype.map;
Array.prototype.map = function () {
    console.warn(msg);
};

Object.groupBy = function () {
    console.warn(msg);
    return "nope";
};

/**
 * @private
 */
Array.prototype._forEach = Array.prototype.forEach;
Array.prototype.forEach = function () {
    console.warn(msg);
};